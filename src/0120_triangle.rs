pub fn minimum_total(triangle: Vec<Vec<i32>>) -> i32 {
    let mut dp = triangle[triangle.len() - 1].clone();

    for row in (0..triangle.len() - 1).rev() {
        for col in 0..=row {
            dp[col] = triangle[row][col] + dp[col].min(dp[col + 1]);
        }
    }

    dp[0]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            minimum_total(vec![vec![2], vec![3, 4], vec![6, 5, 7], vec![4, 1, 8, 3]]),
            11
        );
    }
}
