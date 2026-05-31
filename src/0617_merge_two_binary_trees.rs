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
    pub fn merge_trees(
        t1: Option<Rc<RefCell<TreeNode>>>,
        t2: Option<Rc<RefCell<TreeNode>>>,
    ) -> Option<Rc<RefCell<TreeNode>>> {
        if t1.is_none() && t2.is_none() {
            return None;
        }

        let v1 = t1.as_ref().map_or(0, |node| node.borrow().val);
        let v2 = t2.as_ref().map_or(0, |node| node.borrow().val);

        let left1 = t1.as_ref().and_then(|node| node.borrow().left.clone());
        let right1 = t1.as_ref().and_then(|node| node.borrow().right.clone());
        let left2 = t2.as_ref().and_then(|node| node.borrow().left.clone());
        let right2 = t2.as_ref().and_then(|node| node.borrow().right.clone());

        Some(Rc::new(RefCell::new(TreeNode {
            val: v1 + v2,
            left: Self::merge_trees(left1, left2),
            right: Self::merge_trees(right1, right2),
        })))
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
            tree_to_string(Solution::merge_trees(
                node(1, node(3, node(5, None, None), None), node(2, None, None)),
                node(
                    2,
                    node(1, None, node(4, None, None)),
                    node(3, None, node(7, None, None))
                )
            )),
            "3(4(5(None,None),4(None,None)),5(None,7(None,None)))".to_string()
        );
        assert_eq!(
            tree_to_string(Solution::merge_trees(
                node(1, None, None),
                node(1, node(2, None, None), None)
            )),
            "2(2(None,None),None)".to_string()
        );
    }
}
