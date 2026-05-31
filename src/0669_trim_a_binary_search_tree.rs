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
    pub fn trim_bst(
        root: Option<Rc<RefCell<TreeNode>>>,
        low: i32,
        high: i32,
    ) -> Option<Rc<RefCell<TreeNode>>> {
        let Some(node) = root else {
            return None;
        };

        let val = node.borrow().val;
        if val > high {
            let left = node.borrow_mut().left.take();
            return Self::trim_bst(left, low, high);
        }

        if val < low {
            let right = node.borrow_mut().right.take();
            return Self::trim_bst(right, low, high);
        }

        let left = node.borrow_mut().left.take();
        node.borrow_mut().left = Self::trim_bst(left, low, high);
        let right = node.borrow_mut().right.take();
        node.borrow_mut().right = Self::trim_bst(right, low, high);
        Some(node)
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
            tree_to_string(Solution::trim_bst(
                node(1, node(0, None, None), node(2, None, None)),
                1,
                2
            )),
            tree_to_string(node(1, None, node(2, None, None)))
        );
        assert_eq!(
            tree_to_string(Solution::trim_bst(
                node(
                    3,
                    node(0, None, node(2, node(1, None, None), None)),
                    node(4, None, None)
                ),
                1,
                3
            )),
            tree_to_string(node(3, node(2, node(1, None, None), None), None))
        );
    }
}
