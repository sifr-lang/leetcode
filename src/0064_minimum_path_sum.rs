pub fn min_path_sum(grid: Vec<Vec<i32>>) -> i32 {
    let m = grid.len();
    let n = grid[0].len();
    let inf = i32::MAX / 4;
    let mut prev = vec![inf; n];
    prev[n - 1] = 0;

    for row in (0..m).rev() {
        let mut dp = vec![inf; n];
        for col in (0..n).rev() {
            if col < n - 1 {
                dp[col] = dp[col].min(dp[col + 1]);
            }
            dp[col] = dp[col].min(prev[col]) + grid[row][col];
        }
        prev = dp;
    }

    prev[0]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            min_path_sum(vec![vec![1, 3, 1], vec![1, 5, 1], vec![4, 2, 1]]),
            7
        );
    }
}
