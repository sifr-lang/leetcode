#[derive(PartialEq, Eq, Clone, Debug)]
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

impl ListNode {
    #[inline]
    pub fn new(val: i32) -> Self {
        Self { val, next: None }
    }
}

struct Solution;

impl Solution {
    pub fn merge_in_between(
        mut list1: Option<Box<ListNode>>,
        a: i32,
        b: i32,
        list2: Option<Box<ListNode>>,
    ) -> Option<Box<ListNode>> {
        let mut curr = &mut list1;
        let mut i = 0;
        while i < a - 1 {
            curr = &mut curr.as_mut().unwrap().next;
            i += 1;
        }

        let mut after = curr.as_mut().unwrap().next.take();
        i = a;
        while i <= b {
            after = after.unwrap().next;
            i += 1;
        }
        curr.as_mut().unwrap().next = list2;

        let mut list2_tail = &mut curr.as_mut().unwrap().next;
        while list2_tail.as_ref().unwrap().next.is_some() {
            list2_tail = &mut list2_tail.as_mut().unwrap().next;
        }
        list2_tail.as_mut().unwrap().next = after;

        list1
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn list(values: &[i32]) -> Option<Box<ListNode>> {
        let mut head = None;
        for value in values.iter().rev() {
            head = Some(Box::new(ListNode {
                val: *value,
                next: head,
            }));
        }
        head
    }

    fn list_node_to_string(head: Option<Box<ListNode>>) -> String {
        let mut values = Vec::new();
        let mut curr = head.as_ref();
        while let Some(node) = curr {
            values.push(node.val.to_string());
            curr = node.next.as_ref();
        }
        values.join("->")
    }

    #[test]
    fn main_asserts() {
        assert_eq!(
            list_node_to_string(Solution::merge_in_between(
                list(&[10, 1, 13, 6, 9, 5]),
                3,
                4,
                list(&[1000000, 1000001, 1000002])
            )),
            list_node_to_string(list(&[10, 1, 13, 1000000, 1000001, 1000002, 5]))
        );
        assert_eq!(
            list_node_to_string(Solution::merge_in_between(
                list(&[0, 1, 2, 3, 4, 5, 6]),
                2,
                5,
                list(&[1000000, 1000001, 1000002, 1000003, 1000004])
            )),
            list_node_to_string(list(&[
                0, 1, 1000000, 1000001, 1000002, 1000003, 1000004, 6
            ]))
        );
    }
}
