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
    pub fn remove_nth_from_end(head: Option<Box<ListNode>>, n: i32) -> Option<Box<ListNode>> {
        let mut dummy = Box::new(ListNode {
            val: 0,
            next: head.clone(),
        });
        let (mut left, mut right) = (dummy.as_mut(), head);

        let mut n = n;
        while n > 0 && right.is_some() {
            right = right.unwrap().next;
            n -= 1;
        }

        while let Some(r) = right {
            left = left.next.as_mut().unwrap();
            right = r.next;
        }

        left.next = left.next.take().unwrap().next.take();

        dummy.next
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
            list_values(&Solution::remove_nth_from_end(list(&[1, 2, 3, 4, 5]), 2)),
            vec![1, 2, 3, 5]
        );
        assert!(Solution::remove_nth_from_end(list(&[1]), 1).is_none());
        assert_eq!(
            list_values(&Solution::remove_nth_from_end(list(&[1, 2]), 1)),
            vec![1]
        );
    }
}
