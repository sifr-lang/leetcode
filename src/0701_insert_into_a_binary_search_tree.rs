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
    pub fn insert_into_bst(
        root: Option<Rc<RefCell<TreeNode>>>,
        val: i32,
    ) -> Option<Rc<RefCell<TreeNode>>> {
        match root {
            None => Some(Rc::new(RefCell::new(TreeNode::new(val)))),
            Some(node) => {
                if val > node.borrow().val {
                    let right = node.borrow_mut().right.take();
                    node.borrow_mut().right = Self::insert_into_bst(right, val);
                } else {
                    let left = node.borrow_mut().left.take();
                    node.borrow_mut().left = Self::insert_into_bst(left, val);
                }
                Some(node)
            }
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
            tree_to_string(Solution::insert_into_bst(
                node(
                    4,
                    node(2, node(1, None, None), node(3, None, None)),
                    node(7, None, None)
                ),
                5
            )),
            tree_to_string(node(
                4,
                node(2, node(1, None, None), node(3, None, None)),
                node(7, node(5, None, None), None)
            ))
        );
        assert_eq!(
            tree_to_string(Solution::insert_into_bst(
                node(
                    40,
                    node(20, node(10, None, None), node(30, None, None)),
                    node(60, node(50, None, None), node(70, None, None))
                ),
                25
            )),
            tree_to_string(node(
                40,
                node(
                    20,
                    node(10, None, None),
                    node(30, node(25, None, None), None)
                ),
                node(60, node(50, None, None), node(70, None, None))
            ))
        );
        assert_eq!(
            tree_to_string(Solution::insert_into_bst(
                node(
                    4,
                    node(2, node(1, None, None), node(3, None, None)),
                    node(7, None, None)
                ),
                5
            )),
            tree_to_string(node(
                4,
                node(2, node(1, None, None), node(3, None, None)),
                node(7, node(5, None, None), None)
            ))
        );
    }
}
