use std::cell::RefCell;
use std::collections::HashMap;
use std::rc::Rc;

struct Solution;

#[derive(Debug)]
pub struct Node {
    pub val: i32,
    pub next: Option<Rc<RefCell<Node>>>,
    pub random: Option<Rc<RefCell<Node>>>,
}

impl Node {
    fn new(val: i32) -> Self {
        Self {
            val,
            next: None,
            random: None,
        }
    }
}

impl Solution {
    pub fn copy_random_list(head: Option<Rc<RefCell<Node>>>) -> Option<Rc<RefCell<Node>>> {
        let mut old_to_copy: HashMap<usize, Rc<RefCell<Node>>> = HashMap::new();
        let mut cur = head.clone();
        while let Some(node) = cur {
            let key = Rc::as_ptr(&node) as usize;
            old_to_copy.insert(key, Rc::new(RefCell::new(Node::new(node.borrow().val))));
            cur = node.borrow().next.clone();
        }

        cur = head.clone();
        while let Some(node) = cur {
            let key = Rc::as_ptr(&node) as usize;
            let copy = old_to_copy[&key].clone();
            let next = node
                .borrow()
                .next
                .as_ref()
                .map(|next| old_to_copy[&(Rc::as_ptr(next) as usize)].clone());
            let random = node
                .borrow()
                .random
                .as_ref()
                .map(|random| old_to_copy[&(Rc::as_ptr(random) as usize)].clone());
            copy.borrow_mut().next = next;
            copy.borrow_mut().random = random;
            cur = node.borrow().next.clone();
        }

        head.map(|node| old_to_copy[&(Rc::as_ptr(&node) as usize)].clone())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn build_random_list(spec: &[(i32, i32)]) -> Option<Rc<RefCell<Node>>> {
        if spec.is_empty() {
            return None;
        }
        let nodes: Vec<_> = spec
            .iter()
            .map(|(value, _)| Rc::new(RefCell::new(Node::new(*value))))
            .collect();
        for index in 0..nodes.len().saturating_sub(1) {
            nodes[index].borrow_mut().next = Some(nodes[index + 1].clone());
        }
        for (index, (_, random_index)) in spec.iter().enumerate() {
            if *random_index >= 0 {
                nodes[index].borrow_mut().random = Some(nodes[*random_index as usize].clone());
            }
        }
        Some(nodes[0].clone())
    }

    fn random_list_to_pairs(head: Option<Rc<RefCell<Node>>>) -> Vec<(i32, i32)> {
        let mut nodes = Vec::new();
        let mut cur = head;
        while let Some(node) = cur {
            nodes.push(node.clone());
            cur = node.borrow().next.clone();
        }
        let indices: HashMap<usize, usize> = nodes
            .iter()
            .enumerate()
            .map(|(index, node)| (Rc::as_ptr(node) as usize, index))
            .collect();
        nodes
            .iter()
            .map(|node| {
                let borrowed = node.borrow();
                let random_index = borrowed
                    .random
                    .as_ref()
                    .map_or(-1, |random| indices[&(Rc::as_ptr(random) as usize)] as i32);
                (borrowed.val, random_index)
            })
            .collect()
    }

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            random_list_to_pairs(Solution::copy_random_list(build_random_list(&[
                (7, -1),
                (13, 0),
                (11, 4),
                (10, 2),
                (1, 0)
            ]))),
            vec![(7, -1), (13, 0), (11, 4), (10, 2), (1, 0)]
        );
        assert_eq!(
            random_list_to_pairs(Solution::copy_random_list(build_random_list(&[
                (1, 1),
                (2, 1)
            ]))),
            vec![(1, 1), (2, 1)]
        );
        assert_eq!(
            random_list_to_pairs(Solution::copy_random_list(build_random_list(&[
                (3, -1),
                (3, 0),
                (3, -1)
            ]))),
            vec![(3, -1), (3, 0), (3, -1)]
        );
    }
}
