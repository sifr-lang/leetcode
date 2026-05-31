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
    pub fn invert_tree(root: Option<Rc<RefCell<TreeNode>>>) -> Option<Rc<RefCell<TreeNode>>> {
        root.map(|node| {
            {
                let mut node_ref = node.borrow_mut();
                let left = node_ref.left.take();
                let right = node_ref.right.take();
                node_ref.right = Solution::invert_tree(left);
                node_ref.left = Solution::invert_tree(right);
            }
            node
        })
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
            tree_to_string(Solution::invert_tree(node(
                4,
                node(2, node(1, None, None), node(3, None, None)),
                node(7, node(6, None, None), node(9, None, None))
            ))),
            tree_to_string(node(
                4,
                node(7, node(9, None, None), node(6, None, None)),
                node(2, node(3, None, None), node(1, None, None))
            ))
        );
        assert_eq!(
            tree_to_string(Solution::invert_tree(node(
                2,
                node(1, None, None),
                node(3, None, None)
            ))),
            tree_to_string(node(2, node(3, None, None), node(1, None, None)))
        );
        assert_eq!(Solution::invert_tree(None), None);
    }
}
