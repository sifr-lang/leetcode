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
    pub fn insertion_sort_list(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        let values = list_to_vec(&head);
        let mut sorted: Vec<i32> = Vec::new();
        for value in values {
            let mut index = 0;
            while index < sorted.len() && value >= sorted[index] {
                index += 1;
            }
            sorted.insert(index, value);
        }
        vec_to_list(sorted)
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
            list_values(&Solution::insertion_sort_list(list(&[4, 2, 1, 3]))),
            vec![1, 2, 3, 4]
        );
        assert_eq!(
            list_values(&Solution::insertion_sort_list(list(&[-1, 5, 3, 4, 0]))),
            vec![-1, 0, 3, 4, 5]
        );
    }
}
