use std::collections::HashMap;

struct Solution;

impl Solution {
    pub fn custom_sort_string(order: String, s: String) -> String {
        let mut char_count_of_s = HashMap::<char, usize>::new();
        for ch in s.chars() {
            *char_count_of_s.entry(ch).or_insert(0) += 1;
        }

        let mut satisfied_string = String::new();
        for ch in order.chars() {
            if let Some(count) = char_count_of_s.remove(&ch) {
                for _ in 0..count {
                    satisfied_string.push(ch);
                }
            }
        }

        for (ch, count) in char_count_of_s {
            for _ in 0..count {
                satisfied_string.push(ch);
            }
        }

        satisfied_string
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::custom_sort_string("cba".to_string(), "abcd".to_string()),
            "cbad".to_string()
        );
    }
}
