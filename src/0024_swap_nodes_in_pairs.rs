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
    pub fn swap_pairs(head: Option<Box<ListNode>>) -> Option<Box<ListNode>> {
        match head {
            Some(mut first) => match first.next.take() {
                Some(mut second) => {
                    let next_pair = second.next.take();
                    first.next = Self::swap_pairs(next_pair);
                    second.next = Some(first);
                    Some(second)
                }
                None => Some(first),
            },
            None => None,
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
            list_values(&Solution::swap_pairs(list(&[1, 2, 3, 4]))),
            vec![2, 1, 4, 3]
        );
        assert!(Solution::swap_pairs(None).is_none());
        assert_eq!(list_values(&Solution::swap_pairs(list(&[1]))), vec![1]);
    }
}
