use std::cell::RefCell;
use std::collections::{HashMap, HashSet, VecDeque};
use std::rc::Rc;

struct Solution;

#[derive(Debug)]
pub struct Node {
    pub val: i32,
    pub neighbors: Vec<Rc<RefCell<Node>>>,
}

impl Node {
    fn new(val: i32) -> Self {
        Self {
            val,
            neighbors: Vec::new(),
        }
    }
}

impl Solution {
    pub fn clone_graph(node: Option<Rc<RefCell<Node>>>) -> Option<Rc<RefCell<Node>>> {
        fn dfs(
            node: &Rc<RefCell<Node>>,
            old_to_new: &mut HashMap<usize, Rc<RefCell<Node>>>,
        ) -> Rc<RefCell<Node>> {
            let key = Rc::as_ptr(node) as usize;
            if let Some(existing) = old_to_new.get(&key) {
                return existing.clone();
            }

            let copy = Rc::new(RefCell::new(Node::new(node.borrow().val)));
            old_to_new.insert(key, copy.clone());
            let neighbors = node.borrow().neighbors.clone();
            for neighbor in neighbors {
                copy.borrow_mut().neighbors.push(dfs(&neighbor, old_to_new));
            }
            copy
        }

        node.as_ref().map(|node| dfs(node, &mut HashMap::new()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn build_graph(adjacency: Vec<Vec<i32>>) -> Option<Rc<RefCell<Node>>> {
        if adjacency.is_empty() {
            return None;
        }
        let nodes: Vec<_> = (0..adjacency.len())
            .map(|index| Rc::new(RefCell::new(Node::new(index as i32 + 1))))
            .collect();
        for (index, neighbors) in adjacency.into_iter().enumerate() {
            nodes[index].borrow_mut().neighbors = neighbors
                .into_iter()
                .map(|value| nodes[(value - 1) as usize].clone())
                .collect();
        }
        Some(nodes[0].clone())
    }

    fn graph_to_adj(node: Option<Rc<RefCell<Node>>>) -> Vec<Vec<i32>> {
        let Some(node) = node else {
            return Vec::new();
        };
        let mut queue = VecDeque::from([node]);
        let mut seen = HashSet::new();
        let mut by_val = HashMap::new();
        while let Some(cur) = queue.pop_front() {
            let key = Rc::as_ptr(&cur) as usize;
            if !seen.insert(key) {
                continue;
            }
            let borrowed = cur.borrow();
            let mut neighbors: Vec<i32> = borrowed
                .neighbors
                .iter()
                .map(|neighbor| neighbor.borrow().val)
                .collect();
            neighbors.sort_unstable();
            by_val.insert(borrowed.val, neighbors);
            for neighbor in &borrowed.neighbors {
                queue.push_back(neighbor.clone());
            }
        }
        (1..=by_val.len() as i32)
            .map(|value| by_val.remove(&value).unwrap_or_default())
            .collect()
    }

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            graph_to_adj(Solution::clone_graph(build_graph(vec![
                vec![2, 4],
                vec![1, 3],
                vec![2, 4],
                vec![1, 3]
            ]))),
            vec![vec![2, 4], vec![1, 3], vec![2, 4], vec![1, 3]]
        );
        assert_eq!(
            graph_to_adj(Solution::clone_graph(build_graph(vec![vec![]]))),
            vec![Vec::<i32>::new()]
        );
        assert_eq!(
            graph_to_adj(Solution::clone_graph(build_graph(vec![]))),
            Vec::<Vec<i32>>::new()
        );
    }
}
