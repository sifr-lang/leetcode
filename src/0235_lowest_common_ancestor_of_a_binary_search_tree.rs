use std::cell::RefCell;
use std::rc::Rc;

#[derive(Debug, PartialEq, Eq)]
pub struct TreeNode {
    pub val: i32,
    pub left: Option<Rc<RefCell<TreeNode>>>,
    pub right: Option<Rc<RefCell<TreeNode>>>,
}

impl TreeNode {
    #[inline]
    pub fn new(val: i32) -> Self {
        Self {
            val,
            left: None,
            right: None,
        }
    }
}

struct Solution;

impl Solution {
    pub fn lowest_common_ancestor(
        root: Option<Rc<RefCell<TreeNode>>>,
        p: Option<Rc<RefCell<TreeNode>>>,
        q: Option<Rc<RefCell<TreeNode>>>,
    ) -> Option<Rc<RefCell<TreeNode>>> {
        let p = p.unwrap().borrow().val;
        let q = q.unwrap().borrow().val;
        let mut root = root;

        while let Some(node) = root {
            let val = node.borrow().val;
            if val < p && val < q {
                root = node.borrow().right.clone();
            } else if val > p && val > q {
                root = node.borrow().left.clone();
            } else {
                return Some(node);
            }
        }

        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn node(
        val: i32,
        left: Option<Rc<RefCell<TreeNode>>>,
        right: Option<Rc<RefCell<TreeNode>>>,
    ) -> Option<Rc<RefCell<TreeNode>>> {
        Some(Rc::new(RefCell::new(TreeNode { val, left, right })))
    }

    fn tree_to_string(root: Option<Rc<RefCell<TreeNode>>>) -> String {
        match root {
            Some(node) => {
                let node = node.borrow();
                format!(
                    "{}({},{})",
                    node.val,
                    tree_to_string(node.left.clone()),
                    tree_to_string(node.right.clone())
                )
            }
            None => "None".to_string(),
        }
    }

    #[test]
    fn mirrors_python_main_assertions() {
        let root = node(
            6,
            node(
                2,
                node(0, None, None),
                node(4, node(3, None, None), node(5, None, None)),
            ),
            node(8, node(7, None, None), node(9, None, None)),
        );
        let root_ref = root.clone().unwrap();
        let p = root_ref.borrow().left.clone();
        let q = root_ref.borrow().right.clone();
        assert_eq!(
            tree_to_string(Solution::lowest_common_ancestor(root.clone(), p, q)),
            tree_to_string(root.clone())
        );

        let root_ref = root.clone().unwrap();
        let p = root_ref.borrow().left.clone();
        let q = p.as_ref().unwrap().borrow().right.clone();
        assert_eq!(
            tree_to_string(Solution::lowest_common_ancestor(root, p.clone(), q)),
            tree_to_string(p)
        );

        let root = node(2, node(1, None, None), None);
        assert_eq!(
            tree_to_string(Solution::lowest_common_ancestor(
                root.clone(),
                node(2, None, None),
                node(1, None, None)
            )),
            tree_to_string(root)
        );
    }
}
