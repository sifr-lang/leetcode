struct Solution;

impl Solution {
    pub fn longest_increasing_path(matrix: Vec<Vec<i32>>) -> i32 {
        use std::cmp::max;
        use std::collections::HashMap;

        let mut dp: HashMap<(i32, i32), i32> = HashMap::new();

        fn dfs(
            r: i32,
            c: i32,
            prevVal: i32,
            matrix: &[Vec<i32>],
            dp: &mut HashMap<(i32, i32), i32>,
        ) -> i32 {
            if r < 0
                || r as usize >= matrix.len()
                || c < 0
                || c as usize >= matrix[0].len()
                || matrix[r as usize][c as usize] <= prevVal
            {
                return 0;
            }
            if let Some(&result) = dp.get(&(r, c)) {
                return result;
            }

            let mut res = 1;
            let value = matrix[r as usize][c as usize];
            res = max(res, 1 + dfs(r + 1, c, value, matrix, dp));
            res = max(res, 1 + dfs(r - 1, c, value, matrix, dp));
            res = max(res, 1 + dfs(r, c + 1, value, matrix, dp));
            res = max(res, 1 + dfs(r, c - 1, value, matrix, dp));
            dp.insert((r, c), res);
            res
        }

        for r in 0..matrix.len() {
            for c in 0..matrix[0].len() {
                dfs(r as i32, c as i32, -1, &matrix, &mut dp);
            }
        }
        *dp.values().max().unwrap_or(&1)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::longest_increasing_path(vec![vec![9, 9, 4], vec![6, 6, 8], vec![2, 1, 1]]),
            4
        );
        assert_eq!(
            Solution::longest_increasing_path(vec![vec![3, 4, 5], vec![3, 2, 6], vec![2, 2, 1]]),
            4
        );
        assert_eq!(Solution::longest_increasing_path(vec![vec![1]]), 1);
    }
}
