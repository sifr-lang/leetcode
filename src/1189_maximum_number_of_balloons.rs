struct Solution;

use std::collections::HashMap;

impl Solution {
    pub fn max_number_of_balloons(text: String) -> i32 {
        let mut count_text = HashMap::new();
        let mut balloon = HashMap::new();
        let mut result = text.len();

        for ch in text.chars() {
            *count_text.entry(ch).or_insert(0) += 1;
        }

        for ch in "balloon".chars() {
            *balloon.entry(ch).or_insert(0) += 1;
        }

        for ch in balloon.keys() {
            result = result.min(count_text.get(ch).unwrap_or(&0) / balloon.get(ch).unwrap());
        }

        result as i32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::max_number_of_balloons(String::from("nlaebolko")),
            1
        );
        assert_eq!(
            Solution::max_number_of_balloons(String::from("loonbalxballpoon")),
            2
        );
        assert_eq!(
            Solution::max_number_of_balloons(String::from("leetcode")),
            0
        );
    }
}
