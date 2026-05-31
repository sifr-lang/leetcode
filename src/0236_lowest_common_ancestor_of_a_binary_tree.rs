use std::cell::RefCell;
use std::rc::Rc;

struct Solution;

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

impl Solution {
    pub fn lowest_common_ancestor(
        root: Option<Rc<RefCell<TreeNode>>>,
        p: Option<Rc<RefCell<TreeNode>>>,
        q: Option<Rc<RefCell<TreeNode>>>,
    ) -> Option<Rc<RefCell<TreeNode>>> {
        let root = root?;
        if p.as_ref().is_some_and(|p| Rc::ptr_eq(&root, p))
            || q.as_ref().is_some_and(|q| Rc::ptr_eq(&root, q))
        {
            return Some(root);
        }

        let left = Self::lowest_common_ancestor(root.borrow().left.clone(), p.clone(), q.clone());
        let right = Self::lowest_common_ancestor(root.borrow().right.clone(), p, q);

        if left.is_some() && right.is_some() {
            return Some(root);
        }
        left.or(right)
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
        let n6 = node(6, None, None);
        let n7 = node(7, None, None);
        let n4 = node(4, None, None);
        let n2 = node(2, n7.clone(), n4.clone());
        let n5 = node(5, n6.clone(), n2.clone());
        let n0 = node(0, None, None);
        let n8 = node(8, None, None);
        let n1 = node(1, n0, n8);
        let root = node(3, n5.clone(), n1.clone());

        assert_eq!(
            tree_to_string(Solution::lowest_common_ancestor(
                root.clone(),
                n5.clone(),
                n1.clone()
            )),
            tree_to_string(root.clone())
        );
        assert_eq!(
            tree_to_string(Solution::lowest_common_ancestor(
                root.clone(),
                n5.clone(),
                n4.clone()
            )),
            tree_to_string(n5)
        );
        let root2_left = node(2, None, None);
        let root2 = node(1, root2_left.clone(), None);
        assert_eq!(
            tree_to_string(Solution::lowest_common_ancestor(
                root2.clone(),
                root2.clone(),
                root2_left
            )),
            tree_to_string(root2)
        );
    }
}
