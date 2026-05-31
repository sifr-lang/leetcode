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
    pub fn has_cycle(head: Option<Box<ListNode>>) -> bool {
        let mut slow = head.as_deref();
        let mut fast = head.as_deref();

        while let Some(fast_node) = fast {
            if fast_node.next.is_none() {
                return false;
            }
            slow = slow.and_then(|node| node.next.as_deref());
            fast = fast_node
                .next
                .as_deref()
                .and_then(|node| node.next.as_deref());
            if let (Some(left), Some(right)) = (slow, fast) {
                if std::ptr::eq(left, right) {
                    return true;
                }
            }
        }
        false
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
        assert_eq!(Solution::has_cycle(list(&[0])), false);
    }
}
