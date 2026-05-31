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
    pub fn max_depth(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        if let Some(root) = root {
            let mut frontier: Vec<(i32, Rc<RefCell<TreeNode>>)> = vec![(1, root)];
            let mut max_depth: i32 = 1;

            while let Some((depth, curr)) = frontier.pop() {
                max_depth = depth.max(max_depth);

                if let Some(left) = curr.borrow_mut().left.take() {
                    frontier.push((depth + 1, left));
                }

                if let Some(right) = curr.borrow_mut().right.take() {
                    frontier.push((depth + 1, right));
                }
            }

            max_depth
        } else {
            0
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
            Solution::max_depth(node(
                3,
                node(9, None, None),
                node(20, node(15, None, None), node(7, None, None))
            )),
            3
        );
        assert_eq!(Solution::max_depth(node(1, None, node(2, None, None))), 2);
    }
}
