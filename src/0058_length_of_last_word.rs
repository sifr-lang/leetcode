struct Solution;

impl Solution {
    pub fn length_of_last_word(s: String) -> i32 {
        let s = s.trim_end();
        let s: Vec<char> = s.chars().collect();
        let mut ans = 0;
        for i in (0..s.len()).rev() {
            if !s[i].is_whitespace() {
                ans += 1;
            } else {
                break;
            }
        }
        ans
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::length_of_last_word(String::from("Hello World")),
            5
        );
        assert_eq!(
            Solution::length_of_last_word(String::from("   fly me   to   the moon  ")),
            4
        );
        assert_eq!(
            Solution::length_of_last_word(String::from("luffy is still joyboy")),
            6
        );
        assert_eq!(Solution::length_of_last_word(String::from("a")), 1);
    }
}
