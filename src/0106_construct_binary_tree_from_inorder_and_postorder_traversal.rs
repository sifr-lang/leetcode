use std::cell::RefCell;
use std::collections::HashMap;
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
    pub fn build_tree(inorder: Vec<i32>, mut postorder: Vec<i32>) -> Option<Rc<RefCell<TreeNode>>> {
        fn build_tree_helper(
            left: isize,
            right: isize,
            postorder: &mut Vec<i32>,
            inorder_index_map: &HashMap<i32, isize>,
        ) -> Option<Rc<RefCell<TreeNode>>> {
            if left > right {
                return None;
            }

            let root_val = postorder.pop()?;
            let idx = *inorder_index_map.get(&root_val)?;
            let right_node = build_tree_helper(idx + 1, right, postorder, inorder_index_map);
            let left_node = build_tree_helper(left, idx - 1, postorder, inorder_index_map);

            Some(Rc::new(RefCell::new(TreeNode {
                val: root_val,
                left: left_node,
                right: right_node,
            })))
        }

        let mut inorder_index_map = HashMap::with_capacity(inorder.len());
        for (i, val) in inorder.into_iter().enumerate() {
            inorder_index_map.insert(val, i as isize);
        }

        build_tree_helper(
            0,
            postorder.len() as isize - 1,
            &mut postorder,
            &inorder_index_map,
        )
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
            tree_to_string(Solution::build_tree(
                vec![9, 3, 15, 20, 7],
                vec![9, 15, 7, 20, 3]
            )),
            "3(9(None,None),20(15(None,None),7(None,None)))".to_string()
        );
        assert_eq!(
            tree_to_string(Solution::build_tree(vec![-1], vec![-1])),
            "-1(None,None)".to_string()
        );
    }
}
