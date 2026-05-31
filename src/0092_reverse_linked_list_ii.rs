struct Solution;

#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

impl ListNode {
    #[inline]
    fn new(val: i32) -> Self {
        Self { val, next: None }
    }
}

impl Solution {
    pub fn reverse_between(
        head: Option<Box<ListNode>>,
        left: i32,
        right: i32,
    ) -> Option<Box<ListNode>> {
        let mut values = list_values(&head);
        let start = (left - 1) as usize;
        let end = right as usize;
        values[start..end].reverse();
        list(&values)
    }
}

fn list(values: &[i32]) -> Option<Box<ListNode>> {
    values
        .iter()
        .rev()
        .fold(None, |next, &val| Some(Box::new(ListNode { val, next })))
}

fn list_values(head: &Option<Box<ListNode>>) -> Vec<i32> {
    let mut values = Vec::new();
    let mut cur = head.as_deref();
    while let Some(node) = cur {
        values.push(node.val);
        cur = node.next.as_deref();
    }
    values
}

#[cfg(test)]
mod tests {
    use super::*;

    fn list_node_to_string(head: &Option<Box<ListNode>>) -> String {
        let values = list_values(head);
        if values.is_empty() {
            "None".to_string()
        } else {
            values
                .into_iter()
                .map(|value| value.to_string())
                .collect::<Vec<_>>()
                .join("->")
        }
    }

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            list_node_to_string(&Solution::reverse_between(list(&[1, 2, 3, 4, 5]), 2, 4)),
            "1->4->3->2->5"
        );
        assert_eq!(
            list_node_to_string(&Solution::reverse_between(list(&[5]), 1, 1)),
            "5"
        );
    }
}
