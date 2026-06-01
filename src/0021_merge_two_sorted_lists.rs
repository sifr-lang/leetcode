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
    pub fn merge_two_lists(
        list1: Option<Box<ListNode>>,
        list2: Option<Box<ListNode>>,
    ) -> Option<Box<ListNode>> {
        let mut cur1 = list1.as_deref();
        let mut cur2 = list2.as_deref();
        let mut merged = Vec::new();

        while let (Some(node1), Some(node2)) = (cur1, cur2) {
            if node1.val < node2.val {
                merged.push(node1.val);
                cur1 = node1.next.as_deref();
            } else {
                merged.push(node2.val);
                cur2 = node2.next.as_deref();
            }
        }

        while let Some(node) = cur1 {
            merged.push(node.val);
            cur1 = node.next.as_deref();
        }

        while let Some(node) = cur2 {
            merged.push(node.val);
            cur2 = node.next.as_deref();
        }

        merged
            .into_iter()
            .rev()
            .fold(None, |next, val| Some(Box::new(ListNode { val, next })))
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
            list_values(&Solution::merge_two_lists(
                list(&[1, 2, 4]),
                list(&[1, 3, 4])
            )),
            vec![1, 1, 2, 3, 4, 4]
        );
        assert!(Solution::merge_two_lists(None, None).is_none());
        assert_eq!(
            list_values(&Solution::merge_two_lists(None, list(&[0]))),
            vec![0]
        );
    }
}
