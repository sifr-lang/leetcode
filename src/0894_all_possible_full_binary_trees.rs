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
    pub fn all_possible_fbt(n: i32) -> Vec<Option<Rc<RefCell<TreeNode>>>> {
        let mut dp: HashMap<i32, Vec<Option<Rc<RefCell<TreeNode>>>>> = HashMap::new();
        dp.insert(0, Vec::new());
        dp.insert(1, vec![Some(Rc::new(RefCell::new(TreeNode::new(0))))]);
        Self::backtrack(n, &mut dp)
    }

    fn backtrack(
        n: i32,
        dp: &mut HashMap<i32, Vec<Option<Rc<RefCell<TreeNode>>>>>,
    ) -> Vec<Option<Rc<RefCell<TreeNode>>>> {
        if let Some(trees) = dp.get(&n) {
            return trees.clone();
        }

        let mut res = Vec::new();
        for l in 0..n {
            let r = n - 1 - l;
            let left_trees = Self::backtrack(l, dp);
            let right_trees = Self::backtrack(r, dp);

            for t1 in &left_trees {
                for t2 in &right_trees {
                    res.push(Some(Rc::new(RefCell::new(TreeNode {
                        val: 0,
                        left: t1.clone(),
                        right: t2.clone(),
                    }))));
                }
            }
        }

        dp.insert(n, res.clone());
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn tree_to_string(node: &Option<Rc<RefCell<TreeNode>>>) -> String {
        match node {
            Some(node) => {
                let node = node.borrow();
                format!(
                    "{}({},{})",
                    node.val,
                    tree_to_string(&node.left),
                    tree_to_string(&node.right)
                )
            }
            None => "None".to_string(),
        }
    }

    fn sorted_tree_strings(nodes: Vec<Option<Rc<RefCell<TreeNode>>>>) -> Vec<String> {
        let mut strings: Vec<String> = nodes.iter().map(tree_to_string).collect();
        strings.sort();
        strings
    }

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            sorted_tree_strings(Solution::all_possible_fbt(7)),
            vec![
                "0(0(0(0(None,None),0(None,None)),0(None,None)),0(None,None))".to_string(),
                "0(0(0(None,None),0(0(None,None),0(None,None))),0(None,None))".to_string(),
                "0(0(0(None,None),0(None,None)),0(0(None,None),0(None,None)))".to_string(),
                "0(0(None,None),0(0(0(None,None),0(None,None)),0(None,None)))".to_string(),
                "0(0(None,None),0(0(None,None),0(0(None,None),0(None,None))))".to_string(),
            ]
        );
        assert_eq!(
            sorted_tree_strings(Solution::all_possible_fbt(3)),
            vec!["0(0(None,None),0(None,None))".to_string()]
        );
    }
}
