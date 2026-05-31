use std::cell::RefCell;
use std::collections::VecDeque;
use std::rc::Rc;

type Node = Option<Rc<RefCell<TreeNode>>>;

#[derive(Debug, PartialEq, Eq)]
pub struct TreeNode {
    pub val: i32,
    pub left: Node,
    pub right: Node,
}

impl TreeNode {
    fn new(val: i32) -> Self {
        Self {
            val,
            left: None,
            right: None,
        }
    }

    fn with_children(val: i32, left: Node, right: Node) -> Self {
        Self { val, left, right }
    }
}

struct Codec;

impl Codec {
    fn new() -> Self {
        Self
    }

    fn serialize(&self, root: Node) -> String {
        fn dfs(node: &Node, res: &mut Vec<String>) {
            let Some(node) = node else {
                res.push(String::from("N"));
                return;
            };

            let node = node.borrow();
            res.push(node.val.to_string());
            dfs(&node.left, res);
            dfs(&node.right, res);
        }

        let mut res = Vec::new();
        dfs(&root, &mut res);
        res.join(",")
    }

    fn deserialize(&self, data: String) -> Node {
        fn dfs(vals: &mut VecDeque<&str>) -> Node {
            let val = vals.pop_front()?;
            if val == "N" {
                return None;
            }

            let node = Rc::new(RefCell::new(TreeNode::new(val.parse::<i32>().unwrap())));
            node.borrow_mut().left = dfs(vals);
            node.borrow_mut().right = dfs(vals);
            Some(node)
        }

        let mut vals = data.split(',').collect::<VecDeque<_>>();
        dfs(&mut vals)
    }
}

fn tree_node(val: i32, left: Node, right: Node) -> Node {
    Some(Rc::new(RefCell::new(TreeNode::with_children(
        val, left, right,
    ))))
}

fn tree_to_string(root: Node) -> String {
    Codec::new().serialize(root)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let root = tree_node(
            1,
            tree_node(2, None, None),
            tree_node(3, tree_node(4, None, None), tree_node(5, None, None)),
        );
        let codec = Codec::new();
        assert_eq!(
            tree_to_string(codec.deserialize(codec.serialize(root.clone()))),
            tree_to_string(root)
        );

        let root = None;
        let codec = Codec::new();
        assert_eq!(
            tree_to_string(codec.deserialize(codec.serialize(root.clone()))),
            tree_to_string(root)
        );
    }
}
