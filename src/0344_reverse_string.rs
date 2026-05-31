struct Solution;

impl Solution {
    pub fn reverse_string(s: &mut Vec<String>) {
        let (mut left, mut right) = (0, s.len() - 1);

        while left < right {
            s.swap(left, right);
            left += 1;
            right -= 1;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        let mut arg0 = vec![
            "h".to_string(),
            "e".to_string(),
            "l".to_string(),
            "l".to_string(),
            "o".to_string(),
        ];
        Solution::reverse_string(&mut arg0);
        assert_eq!(
            arg0,
            vec![
                "o".to_string(),
                "l".to_string(),
                "l".to_string(),
                "e".to_string(),
                "h".to_string()
            ]
        );
        let mut arg0 = vec![
            "H".to_string(),
            "a".to_string(),
            "n".to_string(),
            "n".to_string(),
            "a".to_string(),
            "h".to_string(),
        ];
        Solution::reverse_string(&mut arg0);
        assert_eq!(
            arg0,
            vec![
                "h".to_string(),
                "a".to_string(),
                "n".to_string(),
                "n".to_string(),
                "a".to_string(),
                "H".to_string()
            ]
        );
    }
}
