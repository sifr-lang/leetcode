pub fn word_break(s: String, word_dict: Vec<String>) -> bool {
    let bytes = s.as_bytes();
    let words: Vec<&[u8]> = word_dict.iter().map(String::as_bytes).collect();
    let mut dp = vec![false; bytes.len() + 1];
    dp[bytes.len()] = true;

    for i in (0..bytes.len()).rev() {
        for word in &words {
            if i + word.len() <= bytes.len() && &bytes[i..i + word.len()] == *word {
                dp[i] = dp[i + word.len()];
            }
            if dp[i] {
                break;
            }
        }
    }

    dp[0]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            word_break(
                "leetcode".to_string(),
                vec!["leet".to_string(), "code".to_string()]
            ),
            true
        );
        assert_eq!(
            word_break(
                "applepenapple".to_string(),
                vec!["apple".to_string(), "pen".to_string()]
            ),
            true
        );
    }
}
