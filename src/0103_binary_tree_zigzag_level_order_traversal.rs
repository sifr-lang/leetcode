use std::cell::RefCell;
use std::collections::VecDeque;
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
    pub fn zigzag_level_order(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<Vec<i32>> {
        let Some(root) = root else {
            return Vec::new();
        };

        let mut result = Vec::new();
        let mut zigzag_direction = 1;
        let mut q = VecDeque::from([root]);

        while !q.is_empty() {
            let queue_length = q.len();
            let mut level = Vec::with_capacity(queue_length);
            for _ in 0..queue_length {
                let node = q.pop_front().expect("queue length was captured");
                let borrowed = node.borrow();
                level.push(borrowed.val);
                if let Some(left) = borrowed.left.clone() {
                    q.push_back(left);
                }
                if let Some(right) = borrowed.right.clone() {
                    q.push_back(right);
                }
            }
            if zigzag_direction == -1 {
                level.reverse();
            }
            result.push(level);
            zigzag_direction *= -1;
        }

        result
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
            Solution::zigzag_level_order(node(
                3,
                node(9, None, None),
                node(20, node(15, None, None), node(7, None, None))
            )),
            vec![vec![3], vec![20, 9], vec![15, 7]]
        );
        assert_eq!(
            Solution::zigzag_level_order(node(1, None, None)),
            vec![vec![1]]
        );
        assert_eq!(Solution::zigzag_level_order(None), Vec::<Vec<i32>>::new());
    }
}
