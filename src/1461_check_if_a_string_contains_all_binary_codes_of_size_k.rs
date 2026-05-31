struct Solution;

use std::collections::HashSet;

impl Solution {
    pub fn has_all_codes(s: String, k: i32) -> bool {
        let k = k as usize;
        if k > s.len() {
            return false;
        }

        let mut seen = HashSet::new();
        for i in 0..=s.len() - k {
            seen.insert(s[i..i + k].to_string());
        }

        seen.len() == 2usize.pow(k as u32)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::has_all_codes(String::from("00110110"), 2), true);
        assert_eq!(Solution::has_all_codes(String::from("0110"), 1), true);
        assert_eq!(Solution::has_all_codes(String::from("0110"), 2), false);
    }
}
