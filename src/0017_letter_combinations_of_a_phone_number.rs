struct Solution;

impl Solution {
    fn letters_for_digit(digit: u8) -> &'static [u8] {
        match digit {
            b'2' => b"abc",
            b'3' => b"def",
            b'4' => b"ghi",
            b'5' => b"jkl",
            b'6' => b"mno",
            b'7' => b"qprs",
            b'8' => b"tuv",
            b'9' => b"wxyz",
            _ => b"",
        }
    }

    fn backtrack(i: usize, current: &mut String, result: &mut Vec<String>, digits: &[u8]) {
        if current.len() == digits.len() {
            result.push(current.clone());
            return;
        }

        for &ch in Self::letters_for_digit(digits[i]) {
            current.push(ch as char);
            Self::backtrack(i + 1, current, result, digits);
            current.pop();
        }
    }

    pub fn letter_combinations(digits: String) -> Vec<String> {
        let mut result = vec![];

        if !digits.is_empty() {
            let mut current = String::new();
            Self::backtrack(0, &mut current, &mut result, digits.as_bytes());
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::letter_combinations(String::from("23")),
            vec![
                String::from("ad"),
                String::from("ae"),
                String::from("af"),
                String::from("bd"),
                String::from("be"),
                String::from("bf"),
                String::from("cd"),
                String::from("ce"),
                String::from("cf")
            ]
        );
    }
}
