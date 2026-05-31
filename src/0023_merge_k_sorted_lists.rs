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

struct Solution;

impl Solution {
    pub fn merge_k_lists(mut lists: Vec<Option<Box<ListNode>>>) -> Option<Box<ListNode>> {
        if lists.is_empty() {
            return None;
        }

        while lists.len() > 1 {
            let mut merged_lists = Vec::new();
            for i in (0..lists.len()).step_by(2) {
                let l1 = lists[i].take();
                let l2 = if i + 1 < lists.len() {
                    lists[i + 1].take()
                } else {
                    None
                };
                merged_lists.push(Self::merge_list(l1, l2));
            }
            lists = merged_lists;
        }

        lists[0].take()
    }

    fn merge_list(
        mut l1: Option<Box<ListNode>>,
        mut l2: Option<Box<ListNode>>,
    ) -> Option<Box<ListNode>> {
        let mut dummy = Box::new(ListNode::new(0));
        let mut tail = &mut dummy;

        while l1.is_some() && l2.is_some() {
            let take_l1 = l1.as_ref().unwrap().val < l2.as_ref().unwrap().val;
            let mut node = if take_l1 {
                let mut node = l1.take().unwrap();
                l1 = node.next.take();
                node
            } else {
                let mut node = l2.take().unwrap();
                l2 = node.next.take();
                node
            };
            node.next = None;
            tail.next = Some(node);
            tail = tail.next.as_mut().unwrap();
        }

        if l1.is_some() {
            tail.next = l1;
        }
        if l2.is_some() {
            tail.next = l2;
        }

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
        let lists = vec![list(&[1, 4, 5]), list(&[1, 3, 4]), list(&[2, 6])];
        assert_eq!(
            list_values(&Solution::merge_k_lists(lists)),
            vec![1, 1, 2, 3, 4, 4, 5, 6]
        );
        assert!(Solution::merge_k_lists(vec![]).is_none());
    }
}
