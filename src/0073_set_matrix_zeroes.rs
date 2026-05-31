struct Solution;

impl Solution {
    pub fn set_zeroes(matrix: &mut Vec<Vec<i32>>) {
        let rows = matrix.len();
        let cols = matrix[0].len();
        let mut zero_rows = vec![false; rows];
        let mut zero_cols = vec![false; cols];
        for row in 0..rows {
            for col in 0..cols {
                if matrix[row][col] == 0 {
                    zero_rows[row] = true;
                    zero_cols[col] = true;
                }
            }
        }
        for row in 0..rows {
            for col in 0..cols {
                if zero_rows[row] || zero_cols[col] {
                    matrix[row][col] = 0;
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut arg0 = vec![vec![1, 1, 1], vec![1, 0, 1], vec![1, 1, 1]];
        Solution::set_zeroes(&mut arg0);
        assert_eq!(arg0, vec![vec![1, 0, 1], vec![0, 0, 0], vec![1, 0, 1]]);
        let mut arg0 = vec![vec![0, 1, 2, 0], vec![3, 4, 5, 2], vec![1, 3, 1, 5]];
        Solution::set_zeroes(&mut arg0);
        assert_eq!(
            arg0,
            vec![vec![0, 0, 0, 0], vec![0, 4, 5, 0], vec![0, 3, 1, 0]]
        );
    }
}
