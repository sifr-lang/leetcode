use std::cell::RefCell;
use std::collections::HashSet;
use std::rc::Rc;

struct Solution;

#[derive(Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Rc<RefCell<ListNode>>>,
}

impl ListNode {
    fn new(val: i32, next: Option<Rc<RefCell<ListNode>>>) -> Rc<RefCell<Self>> {
        Rc::new(RefCell::new(Self { val, next }))
    }
}

impl Solution {
    pub fn get_intersection_node(
        head_a: Option<Rc<RefCell<ListNode>>>,
        head_b: Option<Rc<RefCell<ListNode>>>,
    ) -> Option<Rc<RefCell<ListNode>>> {
        let mut seen = HashSet::new();
        let mut cur = head_a;
        while let Some(node) = cur {
            seen.insert(Rc::as_ptr(&node) as usize);
            cur = node.borrow().next.clone();
        }

        cur = head_b;
        while let Some(node) = cur {
            if seen.contains(&(Rc::as_ptr(&node) as usize)) {
                return Some(node);
            }
            cur = node.borrow().next.clone();
        }
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn list_node_to_string(node: Option<Rc<RefCell<ListNode>>>) -> String {
        let mut values = Vec::new();
        let mut cur = node;
        while let Some(node) = cur {
            values.push(node.borrow().val.to_string());
            cur = node.borrow().next.clone();
        }
        if values.is_empty() {
            "None".to_string()
        } else {
            values.join("->")
        }
    }

    #[test]
    fn mirrors_python_main_assertions() {
        let shared = ListNode::new(8, Some(ListNode::new(4, Some(ListNode::new(5, None)))));
        let head_a = Some(ListNode::new(
            4,
            Some(ListNode::new(1, Some(shared.clone()))),
        ));
        let head_b = Some(ListNode::new(
            5,
            Some(ListNode::new(6, Some(ListNode::new(1, Some(shared))))),
        ));
        assert_eq!(
            list_node_to_string(Solution::get_intersection_node(head_a, head_b)),
            "8->4->5"
        );

        let head_c = Some(ListNode::new(
            2,
            Some(ListNode::new(6, Some(ListNode::new(4, None)))),
        ));
        let head_d = Some(ListNode::new(1, Some(ListNode::new(5, None))));
        assert_eq!(
            list_node_to_string(Solution::get_intersection_node(head_c, head_d)),
            "None"
        );
    }
}
