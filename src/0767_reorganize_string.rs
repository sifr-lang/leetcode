struct Solution;

use std::cmp::Reverse;
use std::collections::{BinaryHeap, HashMap};

impl Solution {
    pub fn reorganize_string(s: String) -> String {
        let mut counts = HashMap::new();
        for ch in s.chars() {
            *counts.entry(ch).or_insert(0) += 1;
        }

        let mut heap = BinaryHeap::new();
        for (ch, count) in counts {
            heap.push((count, Reverse(ch)));
        }

        let mut prev: Option<(i32, Reverse<char>)> = None;
        let mut result = String::new();
        while !heap.is_empty() || prev.is_some() {
            if heap.is_empty() {
                return String::new();
            }

            let (mut count, ch) = heap.pop().unwrap_or((0, Reverse('\0')));
            result.push(ch.0);
            count -= 1;

            if let Some(item) = prev.take() {
                heap.push(item);
            }
            if count != 0 {
                prev = Some((count, ch));
            }
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::reorganize_string("aab".to_string()),
            "aba".to_string()
        );
        assert_eq!(
            Solution::reorganize_string("aaab".to_string()),
            "".to_string()
        );
    }
}
