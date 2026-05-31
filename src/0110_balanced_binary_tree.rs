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
    pub fn is_balanced(root: Option<Rc<RefCell<TreeNode>>>) -> bool {
        fn dfs(root: Option<Rc<RefCell<TreeNode>>>) -> (bool, i32) {
            match root {
                None => (true, 0),
                Some(node) => {
                    let (l_balanced, l_max) = dfs(node.borrow().left.clone());
                    let (r_balanced, r_max) = dfs(node.borrow().right.clone());
                    let balanced = l_balanced && r_balanced && (l_max - r_max).abs() <= 1;
                    (balanced, 1 + l_max.max(r_max))
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
            Solution::is_balanced(node(
                3,
                node(9, None, None),
                node(20, node(15, None, None), node(7, None, None))
            )),
            true
        );
        assert_eq!(
            Solution::is_balanced(node(
                1,
                node(
                    2,
                    node(3, node(4, None, None), node(4, None, None)),
                    node(3, None, None)
                ),
                node(2, None, None)
            )),
            false
        );
        assert_eq!(Solution::is_balanced(None), true);
    }
}
