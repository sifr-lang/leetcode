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
    pub fn pair_sum(head: Option<Box<ListNode>>) -> i32 {
        let values = list_to_vec(&head);
        let mut result = 0;
        for index in 0..values.len() / 2 {
            result = result.max(values[index] + values[values.len() - index - 1]);
        }
        result
    }
}

fn list_to_vec(head: &Option<Box<ListNode>>) -> Vec<i32> {
    let mut values = Vec::new();
    let mut current = head.as_ref();
    while let Some(node) = current {
        values.push(node.val);
        current = node.next.as_ref();
    }
    values
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
        assert_eq!(Solution::pair_sum(list(&[5, 4, 2, 1])), 6);
        assert_eq!(Solution::pair_sum(list(&[4, 2, 2, 3])), 7);
        assert_eq!(Solution::pair_sum(list(&[1, 100000])), 100001);
    }
}
