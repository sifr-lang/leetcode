struct Solution;

use std::iter::FromIterator;

impl Solution {
    pub fn count_palindromic_subsequence(s: String) -> i32 {
        let mut result = 0;
        let mut ranges: [(i32, i32); 26] = [(-1, -1); 26];

        for (i, c) in s.chars().enumerate() {
            let ix = Solution::char_to_index(c) as usize;
            if ranges[ix].0 == -1 {
                ranges[ix].0 = i as i32;
            }
            if i as i32 > ranges[ix].1 {
                ranges[ix].1 = i as i32;
            }
        }

        for range in ranges {
            if range.1 > range.0 {
                let mut set: u32 = 0;
                for c in s[range.0 as usize + 1..range.1 as usize].chars() {
                    set |= 1 << Solution::char_to_index(c);
                }
                result += set.count_ones() as i32;
            }
        }

        result
    }

    pub fn char_to_index(c: char) -> u32 {
        c as u32 - 'a' as u32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::count_palindromic_subsequence(String::from("aabca")),
            3
        );
        assert_eq!(
            Solution::count_palindromic_subsequence(String::from("adc")),
            0
        );
        assert_eq!(
            Solution::count_palindromic_subsequence(String::from("bbcbaba")),
            4
        );
    }
}
