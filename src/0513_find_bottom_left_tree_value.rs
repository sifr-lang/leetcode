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
    pub fn find_bottom_left_value(root: Option<Rc<RefCell<TreeNode>>>) -> i32 {
        fn dfs(
            root: Option<Rc<RefCell<TreeNode>>>,
            depth: i32,
            max_height: &mut i32,
            res: &mut i32,
        ) {
            let Some(node) = root else {
                return;
            };

            if depth > *max_height {
                *max_height = (*max_height).max(depth);
                *res = node.borrow().val;
            }

            let borrowed = node.borrow();
            dfs(borrowed.left.clone(), depth + 1, max_height, res);
            dfs(borrowed.right.clone(), depth + 1, max_height, res);
        }

        let mut max_height = -1;
        let mut res = -1;
        dfs(root, 0, &mut max_height, &mut res);
        res
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
            Solution::find_bottom_left_value(node(2, node(1, None, None), node(3, None, None))),
            1
        );
        assert_eq!(
            Solution::find_bottom_left_value(node(
                1,
                node(2, node(4, None, None), None),
                node(3, node(5, node(7, None, None), None), node(6, None, None))
            )),
            7
        );
    }
}
