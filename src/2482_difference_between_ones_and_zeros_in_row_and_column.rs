struct Solution;

impl Solution {
    pub fn ones_minus_zeros(grid: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
        let m = grid.len();
        let n = grid[0].len();
        let mut row_count = vec![[0, 0]; m];
        let mut col_count = vec![[0, 0]; n];
        let mut res = Vec::new();

        for r in 0..m {
            for c in 0..n {
                if grid[r][c] == 1 {
                    row_count[r][1] += 1;
                    col_count[c][1] += 1;
                } else {
                    row_count[r][0] += 1;
                    col_count[c][0] += 1;
                }
            }
        }

        for r in 0..m {
            let mut row = Vec::new();
            for c in 0..n {
                row.push(row_count[r][1] + col_count[c][1] - row_count[r][0] - col_count[c][0]);
            }
            res.push(row);
        }

        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::ones_minus_zeros(vec![vec![0, 1, 1], vec![1, 0, 1], vec![0, 0, 1]]),
            vec![vec![0, 0, 4], vec![0, 0, 4], vec![-2, -2, 2]]
        );
        assert_eq!(
            Solution::ones_minus_zeros(vec![vec![1, 1, 1], vec![1, 1, 1]]),
            vec![vec![5, 5, 5], vec![5, 5, 5]]
        );
    }
}
