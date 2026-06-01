use std::collections::HashSet;

struct Solution;

#[derive(Clone, Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
    pub node_id: i32,
}

impl ListNode {
    fn new(val: i32) -> Self {
        Self {
            val,
            next: None,
            node_id: 0,
        }
    }

    fn with_id(val: i32, next: Option<Box<ListNode>>, node_id: i32) -> Box<Self> {
        Box::new(Self { val, next, node_id })
    }
}

impl Solution {
    pub fn get_intersection_node(
        head_a: Option<Box<ListNode>>,
        head_b: Option<Box<ListNode>>,
    ) -> Option<Box<ListNode>> {
        let mut seen = HashSet::new();
        let mut cur = head_a.as_deref();
        while let Some(node) = cur {
            if node.node_id > 0 {
                seen.insert(node.node_id);
            }
            cur = node.next.as_deref();
        }

        cur = head_b.as_deref();
        while let Some(node) = cur {
            if node.node_id > 0 && seen.contains(&node.node_id) {
                return Some(Box::new(node.clone()));
            }
            cur = node.next.as_deref();
        }
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn list_node_to_string(node: Option<Box<ListNode>>) -> String {
        let mut values = Vec::new();
        let mut cur = node.as_deref();
        while let Some(node) = cur {
            values.push(node.val.to_string());
            cur = node.next.as_deref();
        }
        if values.is_empty() {
            "None".to_string()
        } else {
            values.join("->")
        }
    }

    #[test]
    fn mirrors_python_main_assertions() {
        let shared_a = ListNode::with_id(
            8,
            Some(ListNode::with_id(4, Some(ListNode::with_id(5, None, 5)), 4)),
            3,
        );
        let shared_b = ListNode::with_id(
            8,
            Some(ListNode::with_id(4, Some(ListNode::with_id(5, None, 5)), 4)),
            3,
        );
        let head_a = Some(ListNode::with_id(
            4,
            Some(ListNode::with_id(1, Some(shared_a), 2)),
            1,
        ));
        let head_b = Some(ListNode::with_id(
            5,
            Some(ListNode::with_id(
                6,
                Some(ListNode::with_id(1, Some(shared_b), 6)),
                7,
            )),
            8,
        ));
        assert_eq!(
            list_node_to_string(Solution::get_intersection_node(head_a, head_b)),
            "8->4->5"
        );

        let head_c = Some(ListNode::with_id(
            2,
            Some(ListNode::with_id(6, Some(ListNode::with_id(4, None, 12)), 11)),
            10,
        ));
        let head_d = Some(ListNode::with_id(1, Some(ListNode::with_id(5, None, 14)), 13));
        assert_eq!(
            list_node_to_string(Solution::get_intersection_node(head_c, head_d)),
            "None"
        );
    }
}
