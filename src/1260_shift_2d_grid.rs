struct Solution;

impl Solution {
    pub fn shift_grid(grid: Vec<Vec<i32>>, k: i32) -> Vec<Vec<i32>> {
        let rows = grid.len();
        let cols = grid[0].len();
        let total = rows * cols;
        let shift = k as usize % total;
        let mut result = vec![vec![0; cols]; rows];
        for row in 0..rows {
            for col in 0..cols {
                let next = (row * cols + col + shift) % total;
                result[next / cols][next % cols] = grid[row][col];
            }
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
            Solution::shift_grid(vec![vec![1, 2, 3], vec![4, 5, 6], vec![7, 8, 9]], 1),
            vec![vec![9, 1, 2], vec![3, 4, 5], vec![6, 7, 8]]
        );
        assert_eq!(
            Solution::shift_grid(
                vec![
                    vec![3, 8, 1, 9],
                    vec![19, 7, 2, 5],
                    vec![4, 6, 11, 10],
                    vec![12, 0, 21, 13]
                ],
                4
            ),
            vec![
                vec![12, 0, 21, 13],
                vec![3, 8, 1, 9],
                vec![19, 7, 2, 5],
                vec![4, 6, 11, 10]
            ]
        );
        assert_eq!(
            Solution::shift_grid(vec![vec![1, 2, 3], vec![4, 5, 6], vec![7, 8, 9]], 9),
            vec![vec![1, 2, 3], vec![4, 5, 6], vec![7, 8, 9]]
        );
    }
}
