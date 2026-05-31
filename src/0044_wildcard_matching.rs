struct Solution;

impl Solution {
    pub fn is_match(s: String, p: String) -> bool {
        let s = s.as_bytes();
        let p = p.as_bytes();
        let mut dp = vec![vec![false; p.len() + 1]; s.len() + 1];
        dp[s.len()][p.len()] = true;

        for i in (0..=s.len()).rev() {
            for j in (0..p.len()).rev() {
                if p[j] == b'*' {
                    dp[i][j] = dp[i][j + 1] || (i < s.len() && dp[i + 1][j]);
                } else {
                    dp[i][j] = i < s.len() && (p[j] == s[i] || p[j] == b'?') && dp[i + 1][j + 1];
                }
            }
        }

        dp[0][0]
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::is_match("aa".to_string(), "a".to_string()), false);
        assert_eq!(Solution::is_match("aa".to_string(), "*".to_string()), true);
        assert_eq!(
            Solution::is_match("cb".to_string(), "?a".to_string()),
            false
        );
    }
}
