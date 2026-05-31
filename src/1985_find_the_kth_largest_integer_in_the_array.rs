struct Solution;

use std::collections::BinaryHeap;

impl Solution {
    pub fn kth_largest_number(nums: Vec<String>, k: i32) -> String {
        let mut heap = BinaryHeap::new();
        for num in nums {
            let normalized = normalize_number(&num);
            heap.push((normalized.len(), normalized));
        }

        for _ in 1..k {
            heap.pop();
        }

        heap.pop().map_or_else(|| "0".to_string(), |(_, num)| num)
    }
}

fn normalize_number(value: &str) -> String {
    let trimmed = value.trim_start_matches('0');
    if trimmed.is_empty() {
        "0".to_string()
    } else {
        trimmed.to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::kth_largest_number(
                vec![
                    "3".to_string(),
                    "6".to_string(),
                    "7".to_string(),
                    "10".to_string()
                ],
                4
            ),
            "3".to_string()
        );
        assert_eq!(
            Solution::kth_largest_number(
                vec![
                    "2".to_string(),
                    "21".to_string(),
                    "12".to_string(),
                    "1".to_string()
                ],
                3
            ),
            "2".to_string()
        );
        assert_eq!(
            Solution::kth_largest_number(vec!["0".to_string(), "0".to_string()], 2),
            "0".to_string()
        );
    }
}
