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
    pub fn is_subtree(
        root: Option<Rc<RefCell<TreeNode>>>,
        sub_root: Option<Rc<RefCell<TreeNode>>>,
    ) -> bool {
        fn is_sametree(a: Option<Rc<RefCell<TreeNode>>>, b: Option<Rc<RefCell<TreeNode>>>) -> bool {
            match (a, b) {
                (None, None) => true,
                (Some(a), Some(b)) => {
                    a.borrow().val == b.borrow().val
                        && is_sametree(a.borrow().left.clone(), b.borrow().left.clone())
                        && is_sametree(a.borrow().right.clone(), b.borrow().right.clone())
                }
                _ => false,
            }
        }

        match (root, sub_root) {
            (_, None) => true,
            (None, _) => false,
            (Some(root), Some(sub_root)) => {
                if is_sametree(Some(root.clone()), Some(sub_root.clone())) {
                    return true;
                }
                Solution::is_subtree(root.borrow().left.clone(), Some(sub_root.clone()))
                    || Solution::is_subtree(root.borrow().right.clone(), Some(sub_root))
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::cell::RefCell;
    use std::rc::Rc;

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
    fn main_asserts() {
        assert_eq!(
            Solution::is_subtree(
                node(
                    3,
                    node(4, node(1, None, None), node(2, None, None)),
                    node(5, None, None)
                ),
                node(4, node(1, None, None), node(2, None, None))
            ),
            true
        );
        assert_eq!(
            Solution::is_subtree(
                node(
                    3,
                    node(4, node(1, None, None), node(2, node(0, None, None), None)),
                    node(5, None, None)
                ),
                node(4, node(1, None, None), node(2, None, None))
            ),
            false
        );
    }
}
