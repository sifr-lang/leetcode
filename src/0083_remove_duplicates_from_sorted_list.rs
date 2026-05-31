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
    pub fn delete_duplicates(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        match head {
            None => None,
            Some(mut node) => {
                node.next = Self::delete_duplicates(node.next);
                if node.next.as_ref().is_some_and(|next| next.val == node.val) {
                    node.next
                } else {
                    Some(node)
                }
            }
        }
    }
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
            list_values(&Solution::delete_duplicates(list(&[1, 1, 2]))),
            vec![1, 2]
        );
        assert_eq!(
            list_values(&Solution::delete_duplicates(list(&[1, 1, 2, 3, 3]))),
            vec![1, 2, 3]
        );
    }
}
