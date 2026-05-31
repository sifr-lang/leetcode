#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

impl ListNode {
    #[inline]
    fn new(val: i32) -> Self {
        ListNode { val, next: None }
    }
}

struct Solution;

impl Solution {
    pub fn partition(head: Option<Box<ListNode>>, x: i32) -> Option<Box<ListNode>> {
        let mut less = Vec::new();
        let mut bigger = Vec::new();
        let mut current = head.as_ref();
        while let Some(node) = current {
            if node.val < x {
                less.push(node.val);
            } else {
                bigger.push(node.val);
            }
            current = node.next.as_ref();
        }
        less.extend(bigger);
        vec_to_list(less)
    }
}

fn vec_to_list(values: Vec<i32>) -> Option<Box<ListNode>> {
    let mut head = None;
    for value in values.into_iter().rev() {
        let mut node = Box::new(ListNode::new(value));
        node.next = head;
        head = Some(node);
    }
    head
}

#[cfg(test)]
mod tests {
    use super::*;

    fn list(values: &[i32]) -> Option<Box<ListNode>> {
        values
            .iter()
            .rev()
            .fold(None, |next, &val| Some(Box::new(ListNode { val, next })))
    }

    fn list_values(head: &Option<Box<ListNode>>) -> Vec<i32> {
        let mut values = Vec::new();
        let mut current = head.as_deref();
        while let Some(node) = current {
            values.push(node.val);
            current = node.next.as_deref();
        }
        values
    }

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            list_values(&Solution::partition(list(&[1, 4, 3, 2, 5, 2]), 3)),
            vec![1, 2, 2, 4, 3, 5]
        );
        assert_eq!(
            list_values(&Solution::partition(list(&[2, 1]), 2)),
            vec![1, 2]
        );
    }
}
