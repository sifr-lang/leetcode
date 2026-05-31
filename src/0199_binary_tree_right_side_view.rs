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
    pub fn right_side_view(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<i32> {
        if let Some(root) = root {
            let mut frontier: VecDeque<(Rc<RefCell<TreeNode>>, usize)> =
                VecDeque::from([(root, 0)]);
            let mut res = Vec::with_capacity(100);
            let mut res_len: usize = 0;

            while let Some((node, depth)) = frontier.pop_front() {
                let val = node.borrow().val;
                let left = node.borrow_mut().left.take();
                let right = node.borrow_mut().right.take();

                if res_len == depth {
                    res.push(val);
                    res_len += 1;
                } else {
                    res[res_len - 1] = val;
                }

                if let Some(left) = left {
                    frontier.push_back((left, depth + 1));
                }

                if let Some(right) = right {
                    frontier.push_back((right, depth + 1));
                }
            }

            res
        } else {
            vec![]
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
            Solution::right_side_view(node(
                1,
                node(2, None, node(5, None, None)),
                node(3, None, node(4, None, None))
            )),
            vec![1, 3, 4]
        );
        assert_eq!(
            Solution::right_side_view(node(
                1,
                node(2, node(4, node(5, None, None), None), None),
                node(3, None, None)
            )),
            vec![1, 3, 4, 5]
        );
        assert_eq!(
            Solution::right_side_view(node(1, None, node(3, None, None))),
            vec![1, 3]
        );
    }
}
