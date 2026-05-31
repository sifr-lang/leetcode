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
    pub fn postorder_traversal(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<i32> {
        let mut stack = vec![root];
        let mut visit = vec![false];
        let mut res = Vec::new();

        while let Some(cur) = stack.pop() {
            let v = visit.pop().unwrap_or(false);
            if let Some(node) = cur {
                if v {
                    res.push(node.borrow().val);
                } else {
                    let borrowed = node.borrow();
                    stack.push(Some(node.clone()));
                    visit.push(true);
                    stack.push(borrowed.right.clone());
                    visit.push(false);
                    stack.push(borrowed.left.clone());
                    visit.push(false);
                }
            }
        }

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
            Solution::postorder_traversal(node(1, None, node(2, node(3, None, None), None))),
            vec![3, 2, 1]
        );
        assert_eq!(
            Solution::postorder_traversal(node(
                1,
                node(
                    2,
                    node(4, None, None),
                    node(5, node(6, None, None), node(7, None, None))
                ),
                node(3, None, node(8, node(9, None, None), None))
            )),
            vec![4, 6, 7, 5, 2, 9, 8, 3, 1]
        );
        assert_eq!(Solution::postorder_traversal(None), vec![]);
    }
}
