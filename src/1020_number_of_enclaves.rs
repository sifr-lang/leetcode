struct Solution;

impl Solution {
    fn enclave_dfs(grid: &mut Vec<Vec<i32>>, row: i32, col: i32, rows: i32, cols: i32) {
        if (0..rows).contains(&row)
            && (0..cols).contains(&col)
            && grid[row as usize][col as usize] == 1
        {
            grid[row as usize][col as usize] = 0;
            Self::enclave_dfs(grid, row + 1, col, rows, cols);
            Self::enclave_dfs(grid, row - 1, col, rows, cols);
            Self::enclave_dfs(grid, row, col + 1, rows, cols);
            Self::enclave_dfs(grid, row, col - 1, rows, cols);
        }
    }

    pub fn num_enclaves(mut grid: Vec<Vec<i32>>) -> i32 {
        let rows = grid.len() as i32;
        let cols = grid[0].len() as i32;

        for row in 0..rows {
            Self::enclave_dfs(&mut grid, row, 0, rows, cols);
            Self::enclave_dfs(&mut grid, row, cols - 1, rows, cols);
        }

        for col in 0..cols {
            Self::enclave_dfs(&mut grid, 0, col, rows, cols);
            Self::enclave_dfs(&mut grid, rows - 1, col, rows, cols);
        }

        let mut total = 0;
        for row in 0..rows {
            for col in 0..cols {
                if grid[row as usize][col as usize] == 1 {
                    total += 1;
                }
            }
        }
        total
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::num_enclaves(vec![
                vec![0, 0, 0, 0],
                vec![1, 0, 1, 0],
                vec![0, 1, 1, 0],
                vec![0, 0, 0, 0]
            ]),
            3
        );
        assert_eq!(
            Solution::num_enclaves(vec![
                vec![0, 1, 1, 0],
                vec![0, 0, 1, 0],
                vec![0, 0, 1, 0],
                vec![0, 0, 0, 0]
            ]),
            0
        );
    }
}
