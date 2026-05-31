struct Solution;

impl Solution {
    fn split_string_dfs(s: &str, index: usize, prev: i64) -> bool {
        if index == s.len() {
            return true;
        }

        for j in index..s.len() {
            let val = s[index..=j].parse::<i64>().unwrap();
            if val + 1 == prev && Self::split_string_dfs(s, j + 1, val) {
                return true;
            }
        }
        false
    }

    pub fn split_string(s: String) -> bool {
        for i in 0..s.len().saturating_sub(1) {
            let val = s[..=i].parse::<i64>().unwrap();
            if Self::split_string_dfs(&s, i + 1, val) {
                return true;
            }
        }
        false
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::split_string(String::from("1234")), false);
        assert_eq!(Solution::split_string(String::from("050043")), true);
    }
}
