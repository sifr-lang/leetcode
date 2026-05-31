struct Solution;

impl Solution {
    pub fn is_subsequence(s: String, t: String) -> bool {
        let s: Vec<char> = s.chars().collect();
        let t: Vec<char> = t.chars().collect();
        let mut l = 0;
        let mut r = 0;
        while l < s.len() && r < t.len() {
            if s[l] == t[r] {
                l += 1;
                r += 1;
            } else {
                r += 1;
            }
        }
        l == s.len()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::is_subsequence(String::from("abc"), String::from("ahbgdc")),
            true
        );
        assert_eq!(
            Solution::is_subsequence(String::from("axc"), String::from("ahbgdc")),
            false
        );
        assert_eq!(
            Solution::is_subsequence(String::from(""), String::from("ahbgdc")),
            true
        );
        assert_eq!(
            Solution::is_subsequence(String::from("ace"), String::from("abcde")),
            true
        );
    }
}
