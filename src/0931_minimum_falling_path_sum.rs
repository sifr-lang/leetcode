use std::collections::HashMap;

struct Solution;

impl Solution {
    pub fn min_falling_path_sum(matrix: Vec<Vec<i32>>) -> i32 {
        let mut memo = HashMap::<(usize, usize), i32>::new();
        let mut min_value = 10_000_000;
        for k in 0..matrix[0].len() {
            let current_path = Self::path(0, k, matrix[0].len(), &matrix, &mut memo);
            if current_path < min_value {
                min_value = current_path;
            }
        }
        min_value
    }

    fn path(
        i: usize,
        k: usize,
        n: usize,
        matrix: &[Vec<i32>],
        memo: &mut HashMap<(usize, usize), i32>,
    ) -> i32 {
        if let Some(value) = memo.get(&(i, k)) {
            return *value;
        }
        if i == n - 1 {
            return matrix[i][k];
        }

        let value = if k > 0 && k < n - 1 {
            let psx = matrix[i][k] + Self::path(i + 1, k - 1, n, matrix, memo);
            let pst = matrix[i][k] + Self::path(i + 1, k, n, matrix, memo);
            let pdx = matrix[i][k] + Self::path(i + 1, k + 1, n, matrix, memo);
            pdx.min(pst).min(psx)
        } else if k == 0 {
            let pst = matrix[i][k] + Self::path(i + 1, k, n, matrix, memo);
            let pdx = matrix[i][k] + Self::path(i + 1, k + 1, n, matrix, memo);
            pst.min(pdx)
        } else {
            let psx = matrix[i][k] + Self::path(i + 1, k - 1, n, matrix, memo);
            let pst = matrix[i][k] + Self::path(i + 1, k, n, matrix, memo);
            pst.min(psx)
        };

        memo.insert((i, k), value);
        value
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::min_falling_path_sum(vec![vec![2, 1, 3], vec![6, 5, 4], vec![7, 8, 9]]),
            13
        );
        assert_eq!(
            Solution::min_falling_path_sum(vec![vec![-19, 57], vec![-40, -5]]),
            -59
        );
    }
}
