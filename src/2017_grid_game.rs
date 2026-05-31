struct Solution;

impl Solution {
    pub fn grid_game(grid: Vec<Vec<i32>>) -> i64 {
        let n = grid[0].len();

        let mut memo1 = vec![0; n + 1];
        let mut memo2 = vec![0; n + 1];
        for i in 0..n {
            memo1[i + 1] = memo1[i] + grid[0][i] as i64;
            memo2[i + 1] = memo2[i] + grid[1][i] as i64;
        }

        let mut result = i64::max_value();
        for i in 0..n {
            result = result.min(memo2[i].max(memo1[n] - memo1[i + 1]));
        }

        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::grid_game(vec![vec![2, 5, 4], vec![1, 5, 1]]), 4);
        assert_eq!(Solution::grid_game(vec![vec![3, 3, 1], vec![8, 5, 2]]), 4);
        assert_eq!(
            Solution::grid_game(vec![vec![1, 3, 1, 15], vec![1, 3, 3, 1]]),
            7
        );
    }
}
