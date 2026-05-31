struct Solution;

use std::collections::VecDeque;

impl Solution {
    pub fn oranges_rotting(mut grid: Vec<Vec<i32>>) -> i32 {
        let mut q = VecDeque::new();
        let mut fresh = 0;
        let mut time = 0;

        for r in 0..grid.len() {
            for c in 0..grid[0].len() {
                if grid[r][c] == 1 {
                    fresh += 1;
                }
                if grid[r][c] == 2 {
                    q.push_back((r as i32, c as i32));
                }
            }
        }

        let directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        while fresh > 0 && !q.is_empty() {
            let length = q.len();
            for _ in 0..length {
                let (r, c) = q.pop_front().unwrap();
                for [dr, dc] in directions {
                    let row = r + dr;
                    let col = c + dc;
                    if (0..grid.len() as i32).contains(&row)
                        && (0..grid[0].len() as i32).contains(&col)
                        && grid[row as usize][col as usize] == 1
                    {
                        grid[row as usize][col as usize] = 2;
                        q.push_back((row, col));
                        fresh -= 1;
                    }
                }
            }
            time += 1;
        }

        if fresh == 0 {
            time
        } else {
            -1
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::oranges_rotting(vec![vec![2, 1, 1], vec![1, 1, 0], vec![0, 1, 1]]),
            4
        );
        assert_eq!(
            Solution::oranges_rotting(vec![vec![2, 1, 1], vec![0, 1, 1], vec![1, 0, 1]]),
            -1
        );
        assert_eq!(Solution::oranges_rotting(vec![vec![0, 2]]), 0);
    }
}
