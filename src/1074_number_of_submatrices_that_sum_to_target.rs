use std::collections::HashMap;

struct Solution;

impl Solution {
    pub fn num_submatrix_sum_target(matrix: Vec<Vec<i32>>, target: i32) -> i32 {
        let rows = matrix.len();
        let cols = matrix[0].len();
        let mut sub_sum = vec![vec![0; cols]; rows];

        for r in 0..rows {
            for c in 0..cols {
                let top = if r > 0 { sub_sum[r - 1][c] } else { 0 };
                let left = if c > 0 { sub_sum[r][c - 1] } else { 0 };
                let top_left = if r.min(c) > 0 {
                    sub_sum[r - 1][c - 1]
                } else {
                    0
                };
                sub_sum[r][c] = matrix[r][c] + top + left - top_left;
            }
        }

        let mut res = 0;
        for r1 in 0..rows {
            for r2 in r1..rows {
                let mut count = HashMap::<i32, i32>::new();
                count.insert(0, 1);
                for c in 0..cols {
                    let cur_sum = sub_sum[r2][c] - if r1 > 0 { sub_sum[r1 - 1][c] } else { 0 };
                    let diff = cur_sum - target;
                    res += count.get(&diff).copied().unwrap_or(0);
                    *count.entry(cur_sum).or_insert(0) += 1;
                }
            }
        }

        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::num_submatrix_sum_target(
                vec![vec![0, 1, 0], vec![1, 1, 1], vec![0, 1, 0]],
                0
            ),
            4
        );
        assert_eq!(
            Solution::num_submatrix_sum_target(vec![vec![1, -1], vec![-1, 1]], 0),
            5
        );
        assert_eq!(Solution::num_submatrix_sum_target(vec![vec![904]], 0), 0);
    }
}
