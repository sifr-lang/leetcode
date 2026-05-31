struct Solution;

use std::cmp::Reverse;
use std::collections::BinaryHeap;

impl Solution {
    pub fn minimum_effort_path(heights: Vec<Vec<i32>>) -> i32 {
        let rows = heights.len();
        let cols = heights[0].len();
        let mut dist = vec![vec![i32::MAX; cols]; rows];
        let mut heap = BinaryHeap::new();
        dist[0][0] = 0;
        heap.push(Reverse((0, 0usize, 0usize)));
        let dirs = [(1i32, 0i32), (-1, 0), (0, 1), (0, -1)];
        while let Some(Reverse((effort, row, col))) = heap.pop() {
            if row == rows - 1 && col == cols - 1 {
                return effort;
            }
            if effort > dist[row][col] {
                continue;
            }
            for (dr, dc) in dirs {
                let nr = row as i32 + dr;
                let nc = col as i32 + dc;
                if nr >= 0 && nc >= 0 && (nr as usize) < rows && (nc as usize) < cols {
                    let nr = nr as usize;
                    let nc = nc as usize;
                    let next = effort.max((heights[row][col] - heights[nr][nc]).abs());
                    if next < dist[nr][nc] {
                        dist[nr][nc] = next;
                        heap.push(Reverse((next, nr, nc)));
                    }
                }
            }
        }
        0
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::minimum_effort_path(vec![vec![1, 2, 2], vec![3, 8, 2], vec![5, 3, 5]]),
            2
        );
        assert_eq!(
            Solution::minimum_effort_path(vec![vec![1, 2, 3], vec![3, 8, 4], vec![5, 3, 5]]),
            1
        );
        assert_eq!(
            Solution::minimum_effort_path(vec![
                vec![1, 2, 1, 1, 1],
                vec![1, 2, 1, 2, 1],
                vec![1, 2, 1, 2, 1],
                vec![1, 2, 1, 2, 1],
                vec![1, 1, 1, 2, 1]
            ]),
            0
        );
    }
}
