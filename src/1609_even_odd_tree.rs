use std::cell::RefCell;
use std::collections::VecDeque;
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
    pub fn is_even_odd_tree(root: Option<Rc<RefCell<TreeNode>>>) -> bool {
        let mut even = true;
        let mut q = VecDeque::new();
        if let Some(root) = root {
            q.push_back(root);
        }

        while !q.is_empty() {
            let mut prev = if even { i32::MIN } else { i32::MAX };
            for _ in 0..q.len() {
                let node = q.pop_front().unwrap();
                let node = node.borrow();

                if even && (node.val % 2 == 0 || node.val <= prev) {
                    return false;
                } else if !even && (node.val % 2 == 1 || node.val >= prev) {
                    return false;
                }

                if let Some(left) = node.left.clone() {
                    q.push_back(left);
                }
                if let Some(right) = node.right.clone() {
                    q.push_back(right);
                }
                prev = node.val;
            }
            even = !even;
        }

        true
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

    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::is_even_odd_tree(node(
                1,
                node(10, node(3, node(12, None, None), node(8, None, None)), None),
                node(
                    4,
                    node(7, node(6, None, None), None),
                    node(9, None, node(2, None, None))
                )
            )),
            true
        );
        assert_eq!(
            Solution::is_even_odd_tree(node(
                5,
                node(4, node(3, None, None), node(3, None, None)),
                node(2, node(7, None, None), None)
            )),
            false
        );
        assert_eq!(
            Solution::is_even_odd_tree(node(
                5,
                node(9, node(3, None, None), node(5, None, None)),
                node(1, node(7, None, None), None)
            )),
            false
        );
    }
}
