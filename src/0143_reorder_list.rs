#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

struct Solution;

impl Solution {
    pub fn reorder_list(head: &mut Option<Box<ListNode>>) {
        let mut length = 0;
        let mut cur = head.as_ref();
        while let Some(node) = cur {
            length += 1;
            cur = node.next.as_ref();
        }

        if length <= 2 {
            return;
        }

        let first_len = (length + 1) / 2;
        let mut slow = head.as_mut();
        for _ in 1..first_len {
            slow = slow.unwrap().next.as_mut();
        }

        let mut second = slow.unwrap().next.take();
        let mut prev = None;
        while let Some(mut node) = second {
            let tmp = node.next.take();
            node.next = prev;
            prev = Some(node);
            second = tmp;
        }

        let mut first = head.take();
        let mut second = prev;
        let mut merged = None;
        let mut tail = &mut merged;

        while first.is_some() || second.is_some() {
            if let Some(mut node) = first {
                first = node.next.take();
                tail.replace(node);
                tail = &mut tail.as_mut().unwrap().next;
            }
            if let Some(mut node) = second {
                second = node.next.take();
                tail.replace(node);
                tail = &mut tail.as_mut().unwrap().next;
            }
        }

        *head = merged;
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
        let mut arg0 = list(&[1, 2, 3, 4]);
        Solution::reorder_list(&mut arg0);
        assert_eq!(list_values(&arg0), vec![1, 4, 2, 3]);

        let mut arg0 = list(&[1, 2, 3, 4, 5]);
        Solution::reorder_list(&mut arg0);
        assert_eq!(list_values(&arg0), vec![1, 5, 2, 4, 3]);
    }
}
