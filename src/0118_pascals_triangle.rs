struct Solution;

impl Solution {
    pub fn generate(num_rows: i32) -> Vec<Vec<i64>> {
        let mut ans: Vec<Vec<i64>> = Vec::new();

        for row_index in 0..num_rows as usize {
            let mut row = vec![1; row_index + 1];
            for col in 1..row_index {
                row[col] = ans[row_index - 1][col - 1] + ans[row_index - 1][col];
            }
            ans.push(row);
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
            Solution::generate(5),
            vec![
                vec![1],
                vec![1, 1],
                vec![1, 2, 1],
                vec![1, 3, 3, 1],
                vec![1, 4, 6, 4, 1]
            ]
        );
    }
}
