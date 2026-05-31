struct Solution;

impl Solution {
    pub fn merge_alternately(word1: String, word2: String) -> String {
        let a: Vec<char> = word1.chars().collect();
        let b: Vec<char> = word2.chars().collect();
        let mut result = String::new();
        for i in 0..a.len().max(b.len()) {
            if i < a.len() {
                result.push(a[i]);
            }
            if i < b.len() {
                result.push(b[i]);
            }
        }
        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::merge_alternately("abc".to_string(), "pqr".to_string()),
            "apbqcr".to_string()
        );
        assert_eq!(
            Solution::merge_alternately("ab".to_string(), "pqrs".to_string()),
            "apbqrs".to_string()
        );
        assert_eq!(
            Solution::merge_alternately("abcd".to_string(), "pq".to_string()),
            "apbqcd".to_string()
        );
    }
}
