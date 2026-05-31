struct Solution;

use std::collections::{HashSet, VecDeque};

impl Solution {
    pub fn shortest_path_binary_matrix(grid: Vec<Vec<i32>>) -> i32 {
        let n = grid.len() as i32;
        let mut q = VecDeque::new();
        q.push_back((0, 0, 1));
        let mut visit = HashSet::new();
        visit.insert((0, 0));
        let direct = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
            [1, 1],
            [-1, -1],
            [1, -1],
            [-1, 1],
        ];

        while let Some((r, c, length)) = q.pop_front() {
            if r.min(c) < 0 || r.max(c) >= n || grid[r as usize][c as usize] != 0 {
                continue;
            }
            if r == n - 1 && c == n - 1 {
                return length;
            }
            for [dr, dc] in direct {
                let next = (r + dr, c + dc);
                if !visit.contains(&next) {
                    q.push_back((next.0, next.1, length + 1));
                    visit.insert(next);
                }
            }
        }

        -1
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::shortest_path_binary_matrix(vec![vec![0, 1], vec![1, 0]]),
            2
        );
        assert_eq!(
            Solution::shortest_path_binary_matrix(vec![
                vec![0, 0, 0],
                vec![1, 1, 0],
                vec![1, 1, 0]
            ]),
            4
        );
        assert_eq!(
            Solution::shortest_path_binary_matrix(vec![
                vec![1, 0, 0],
                vec![1, 1, 0],
                vec![1, 1, 0]
            ]),
            -1
        );
    }
}
