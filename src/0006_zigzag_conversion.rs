struct Solution;

impl Solution {
    pub fn convert(s: String, num_rows: i32) -> String {
        if num_rows == 1 || s.len() <= num_rows as usize {
            return s;
        }
        let mut rows = vec![String::new(); num_rows as usize];
        let mut row = 0i32;
        let mut step = 1i32;
        for ch in s.chars() {
            rows[row as usize].push(ch);
            if row == 0 {
                step = 1;
            } else if row == num_rows - 1 {
                step = -1;
            }
            row += step;
        }
        rows.concat()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::convert("PAYPALISHIRING".to_string(), 3),
            "PAHNAPLSIIGYIR".to_string()
        );
        assert_eq!(Solution::convert("A".to_string(), 1), "A".to_string());
    }
}
