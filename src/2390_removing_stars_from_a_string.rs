struct Solution;

impl Solution {
    pub fn remove_stars(s: String) -> String {
        let mut stack = Vec::new();
        for ch in s.chars() {
            if ch == '*' {
                stack.pop();
            } else {
                stack.push(ch);
            }
        }
        stack.into_iter().collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::remove_stars("leet**cod*e".to_string()),
            "lecoe".to_string()
        );
    }
}
