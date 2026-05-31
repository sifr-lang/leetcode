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
    pub fn min_diff_in_bst(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        fn inorder(
            node: Option<Rc<RefCell<TreeNode>>>,
            curr_smallest: &mut i32,
            prev: &mut Option<i32>,
        ) {
            let Some(node) = node else {
                return;
            };

            let borrowed = node.borrow();
            inorder(borrowed.left.clone(), curr_smallest, prev);
            if let Some(prev_val) = *prev {
                *curr_smallest = (*curr_smallest).min(borrowed.val - prev_val);
            }
            *prev = Some(borrowed.val);
            inorder(borrowed.right.clone(), curr_smallest, prev);
        }

        let mut curr_smallest = i32::MAX;
        let mut prev = None;
        inorder(root, &mut curr_smallest, &mut prev);
        curr_smallest
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
            Solution::min_diff_in_bst(node(
                4,
                node(2, node(1, None, None), node(3, None, None)),
                node(6, None, None)
            )),
            1
        );
        assert_eq!(
            Solution::min_diff_in_bst(node(
                1,
                node(0, None, None),
                node(48, node(12, None, None), node(49, None, None))
            )),
            1
        );
    }
}
