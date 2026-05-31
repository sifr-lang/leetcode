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
    pub fn level_order(root: Option<Rc<RefCell<TreeNode>>>) -> Vec<Vec<i32>> {
        if let Some(root) = root {
            let mut frontier: Vec<(Rc<RefCell<TreeNode>>, u16)> = vec![(root, 0)];
            let mut res: Vec<Vec<i32>> = vec![];
            let mut len: u16 = 0;

            while let Some((node, depth)) = frontier.pop() {
                let val = node.borrow().val;

                if depth == len {
                    res.push(vec![val]);
                    len += 1;
                } else {
                    res[depth as usize].push(val);
                }

                if let Some(right) = node.borrow_mut().right.take() {
                    frontier.push((right, depth + 1));
                }

                if let Some(left) = node.borrow_mut().left.take() {
                    frontier.push((left, depth + 1));
                }
            }

            res
        } else {
            vec![]
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
            Solution::level_order(node(
                3,
                node(9, None, None),
                node(20, node(15, None, None), node(7, None, None))
            )),
            vec![vec![3], vec![9, 20], vec![15, 7]]
        );
        assert_eq!(Solution::level_order(node(1, None, None)), vec![vec![1]]);
        assert_eq!(Solution::level_order(None), Vec::<Vec<i32>>::new());
    }
}
