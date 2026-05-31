struct Solution;

impl Solution {
    pub fn convert_to_title(mut column_number: i32) -> String {
        let mut result = Vec::new();
        while column_number > 0 {
            column_number -= 1;
            result.push(((column_number % 26) as u8 + b'A') as char);
            column_number /= 26;
        }
        result.iter().rev().collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::convert_to_title(1), "A".to_string());
        assert_eq!(Solution::convert_to_title(28), "AB".to_string());
        assert_eq!(Solution::convert_to_title(701), "ZY".to_string());
    }
}
