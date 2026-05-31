pub fn is_interleave(s1: String, s2: String, s3: String) -> bool {
    if s1.len() + s2.len() != s3.len() {
        return false;
    }

    let s1 = s1.as_bytes();
    let s2 = s2.as_bytes();
    let s3 = s3.as_bytes();
    let mut dp = vec![vec![false; s2.len() + 1]; s1.len() + 1];
    dp[s1.len()][s2.len()] = true;

    for i in (0..=s1.len()).rev() {
        for j in (0..=s2.len()).rev() {
            if i < s1.len() && s1[i] == s3[i + j] && dp[i + 1][j] {
                dp[i][j] = true;
            }
            if j < s2.len() && s2[j] == s3[i + j] && dp[i][j + 1] {
                dp[i][j] = true;
            }
        }
    }

    dp[0][0]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            is_interleave(
                "aabcc".to_string(),
                "dbbca".to_string(),
                "aadbbcbcac".to_string()
            ),
            true
        );
        assert_eq!(
            is_interleave(
                "aabcc".to_string(),
                "dbbca".to_string(),
                "aadbbbaccc".to_string()
            ),
            false
        );
    }
}
