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
    pub fn kth_smallest(root: Option<Rc<RefCell<TreeNode>>>, k: i32) -> i32 {
        fn into_vec(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<i32> {
            match root {
                None => vec![],
                Some(node) => into_vec(node.borrow().left.clone())
                    .into_iter()
                    .chain(vec![node.borrow().val])
                    .chain(into_vec(node.borrow().right.clone()))
                    .collect(),
            }
        }

        into_vec(root)[k as usize - 1]
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
            Solution::kth_smallest(
                node(3, node(1, None, node(2, None, None)), node(4, None, None)),
                1
            ),
            1
        );
        assert_eq!(
            Solution::kth_smallest(
                node(
                    5,
                    node(3, node(2, node(1, None, None), None), node(4, None, None)),
                    node(6, None, None)
                ),
                3
            ),
            3
        );
    }
}
