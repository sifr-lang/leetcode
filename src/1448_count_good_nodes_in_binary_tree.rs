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
    pub fn good_nodes(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        let root = root.unwrap();
        let val = root.borrow().val;
        let mut count = 0;
        let mut stack = Vec::with_capacity(10_000);
        stack.push((root, val as i16));

        while let Some((curr, mut max)) = stack.pop() {
            let mut curr = curr.borrow_mut();
            if curr.val as i16 >= max {
                count += 1;
                max = curr.val as i16;
            }
            if curr.left.is_some() {
                let mut left = None;
                std::mem::swap(&mut left, &mut curr.left);
                stack.push((left.unwrap(), max));
            }
            if curr.right.is_some() {
                let mut right = None;
                std::mem::swap(&mut right, &mut curr.right);
                stack.push((right.unwrap(), max));
            }
        }

        count
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
            Solution::good_nodes(node(
                3,
                node(1, node(3, None, None), None),
                node(4, node(1, None, None), node(5, None, None))
            )),
            4
        );
        assert_eq!(
            Solution::good_nodes(node(
                3,
                node(3, node(4, None, None), node(2, None, None)),
                None
            )),
            3
        );
        assert_eq!(Solution::good_nodes(node(1, None, None)), 1);
    }
}
