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
    pub fn sorted_array_to_bst(nums: Vec<i32>) -> Option<Rc<RefCell<TreeNode>>> {
        fn build(nums: &[i32]) -> Option<Rc<RefCell<TreeNode>>> {
            if nums.is_empty() {
                return None;
            }

            let mid = nums.len() / 2;
            Some(Rc::new(RefCell::new(TreeNode {
                val: nums[mid],
                left: build(&nums[..mid]),
                right: build(&nums[mid + 1..]),
            })))
        }

        build(&nums)
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
            tree_to_string(Solution::sorted_array_to_bst(vec![-10, -3, 0, 5, 9])),
            "0(-3(-10(None,None),None),9(5(None,None),None))".to_string()
        );
        assert_eq!(
            tree_to_string(Solution::sorted_array_to_bst(vec![1, 3])),
            "3(1(None,None),None)".to_string()
        );
    }
}
