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
    pub fn reverse_k_group(head: Option<Box<ListNode>>, k: i32) -> Option<Box<ListNode>> {
        let mut dummy = Some(Box::new(ListNode { next: head, val: 0 }));
        let mut cur = dummy.as_mut();

        'outer: loop {
            let mut start = cur.as_mut().unwrap().next.take();
            if start.is_none() {
                break 'outer;
            }

            let mut end = start.as_mut();
            for _ in 0..(k - 1) {
                end = end.unwrap().next.as_mut();

                if end.is_none() {
                    cur.as_mut().unwrap().next = start;
                    break 'outer;
                }
            }

            let mut tail = end.as_mut().unwrap().next.take();
            let end = Solution::reverse(start, tail);
            cur.as_mut().unwrap().next = end;

            for _ in 0..k {
                cur = cur.unwrap().next.as_mut()
            }
        }
        dummy.unwrap().next
    }

    fn reverse(
        mut head: Option<Box<ListNode>>,
        tail: Option<Box<ListNode>>,
    ) -> Option<Box<ListNode>> {
        let mut prev = tail;
        let mut cur = head;

        while let Some(mut cur_node) = cur {
            let mut next = cur_node.next.take();
            cur_node.next = prev.take();
            prev = Some(cur_node);
            cur = next
        }
        prev
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
            list_values(&Solution::reverse_k_group(list(&[1, 2, 3, 4, 5]), 2)),
            vec![2, 1, 4, 3, 5]
        );
        assert_eq!(
            list_values(&Solution::reverse_k_group(list(&[1, 2, 3, 4, 5]), 3)),
            vec![3, 2, 1, 4, 5]
        );
    }
}
