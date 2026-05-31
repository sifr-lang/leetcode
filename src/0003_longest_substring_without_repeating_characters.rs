use std::collections::VecDeque;

struct Solution;

impl Solution {
    pub fn length_of_longest_substring(s: String) -> i32 {
        let mut set: VecDeque<char> = VecDeque::new();
        let mut longest = 0;

        for c in s.chars() {
            while set.contains(&c) {
                set.pop_front();
            }

            set.push_back(c);
            longest = longest.max(set.len());
        }

        longest as i32
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::length_of_longest_substring("abcabcbb".to_string()),
            3
        );
        assert_eq!(
            Solution::length_of_longest_substring("bbbbb".to_string()),
            1
        );
        assert_eq!(
            Solution::length_of_longest_substring("pwwkew".to_string()),
            3
        );
    }
}
