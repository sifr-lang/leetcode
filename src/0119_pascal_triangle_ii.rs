struct Solution;

impl Solution {
    pub fn get_row(row_index: i32) -> Vec<i32> {
        if row_index == 0 {
            return vec![1];
        }
        let previous = Self::get_row(row_index - 1);
        let mut result = vec![1];
        for i in 0..previous.len().saturating_sub(1) {
            result.push(previous[i] + previous[i + 1]);
        }
        result.push(1);
        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::get_row(3), vec![1, 3, 3, 1]);
        assert_eq!(Solution::get_row(0), vec![1]);
    }
}
