struct Solution;

impl Solution {
    pub fn diagonal_sum(mat: Vec<Vec<i32>>) -> i32 {
        let n = mat.len();
        let mut total = 0;
        for i in 0..n {
            total += mat[i][i] + mat[i][n - 1 - i];
        }
        if n % 2 == 1 {
            total -= mat[n / 2][n / 2];
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
            Solution::diagonal_sum(vec![vec![1, 2, 3], vec![4, 5, 6], vec![7, 8, 9]]),
            25
        );
    }
}
