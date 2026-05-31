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
    pub fn has_path_sum(root: Option<Rc<RefCell<TreeNode>>>, sum: i32) -> bool {
        let Some(root) = root else {
            return false;
        };
        let root_val = root.borrow().val;
        let mut de = vec![(root, sum - root_val)];

        while let Some((node, curr_sum)) = de.pop() {
            let borrowed = node.borrow();
            if borrowed.left.is_none() && borrowed.right.is_none() && curr_sum == 0 {
                return true;
            }
            if let Some(right) = borrowed.right.clone() {
                let right_val = right.borrow().val;
                de.push((right, curr_sum - right_val));
            }
            if let Some(left) = borrowed.left.clone() {
                let left_val = left.borrow().val;
                de.push((left, curr_sum - left_val));
            }
        }

        false
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
        let root = node(
            5,
            node(4, node(11, node(7, None, None), node(2, None, None)), None),
            node(8, node(13, None, None), node(4, None, node(1, None, None))),
        );
        assert_eq!(Solution::has_path_sum(root, 22), true);
        assert_eq!(
            Solution::has_path_sum(node(1, node(2, None, None), node(3, None, None)), 5),
            false
        );
        assert_eq!(Solution::has_path_sum(None, 0), false);
    }
}
