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
    pub fn max_path_sum(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        fn dfs(node: Option<Rc<RefCell<TreeNode>>>) -> (i32, i32) {
            match node {
                None => (-1001, -1001),
                Some(node) => {
                    let (l_max, l_sum) = dfs(node.borrow().left.clone());
                    let (r_max, r_sum) = dfs(node.borrow().right.clone());
                    let val = node.borrow().val;

                    (
                        l_max.max(r_max).max(val + l_sum.max(0) + r_sum.max(0)),
                        val.max(val + l_sum).max(val + r_sum),
                    )
                }
            }
        }

        dfs(root).0
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
            Solution::max_path_sum(node(1, node(2, None, None), node(3, None, None))),
            6
        );
        assert_eq!(
            Solution::max_path_sum(node(
                -10,
                node(9, None, None),
                node(20, node(15, None, None), node(7, None, None))
            )),
            42
        );
    }
}
