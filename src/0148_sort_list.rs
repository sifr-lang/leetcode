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
    pub fn sort_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        let mut values = list_to_vec(&head);
        merge_sort(&mut values);
        vec_to_list(values)
    }
}

fn merge_sort(values: &mut [i32]) {
    let len = values.len();
    if len <= 1 {
        return;
    }
    let mid = len / 2;
    merge_sort(&mut values[..mid]);
    merge_sort(&mut values[mid..]);

    let mut merged = Vec::with_capacity(len);
    let (left, right) = values.split_at(mid);
    let mut left_index = 0;
    let mut right_index = 0;
    while left_index < left.len() && right_index < right.len() {
        if left[left_index] < right[right_index] {
            merged.push(left[left_index]);
            left_index += 1;
        } else {
            merged.push(right[right_index]);
            right_index += 1;
        }
    }
    merged.extend_from_slice(&left[left_index..]);
    merged.extend_from_slice(&right[right_index..]);
    values.copy_from_slice(&merged);
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
            list_values(&Solution::sort_list(list(&[4, 2, 1, 3]))),
            vec![1, 2, 3, 4]
        );
        assert_eq!(
            list_values(&Solution::sort_list(list(&[-1, 5, 3, 4, 0]))),
            vec![-1, 0, 3, 4, 5]
        );
        assert!(Solution::sort_list(None).is_none());
    }
}
