struct Solution;

impl Solution {
    pub fn repeated_substring_pattern(s: String) -> bool {
        let doubled = format!("{s}{s}");
        doubled[1..doubled.len() - 1].contains(&s)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::repeated_substring_pattern(String::from("abab")),
            true
        );
        assert_eq!(
            Solution::repeated_substring_pattern(String::from("aba")),
            false
        );
    }
}
