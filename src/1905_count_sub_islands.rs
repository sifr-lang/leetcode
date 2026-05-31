struct Solution;

use std::collections::HashSet;

impl Solution {
    fn sub_island_dfs(
        r: i32,
        c: i32,
        grid1: &[Vec<i32>],
        grid2: &[Vec<i32>],
        visit: &mut HashSet<(i32, i32)>,
    ) -> bool {
        let rows = grid1.len() as i32;
        let cols = grid1[0].len() as i32;
        if r < 0
            || c < 0
            || r == rows
            || c == cols
            || grid2[r as usize][c as usize] == 0
            || visit.contains(&(r, c))
        {
            return true;
        }

        visit.insert((r, c));
        let mut res = true;
        if grid1[r as usize][c as usize] == 0 {
            res = false;
        }

        res = Self::sub_island_dfs(r - 1, c, grid1, grid2, visit) && res;
        res = Self::sub_island_dfs(r + 1, c, grid1, grid2, visit) && res;
        res = Self::sub_island_dfs(r, c - 1, grid1, grid2, visit) && res;
        res = Self::sub_island_dfs(r, c + 1, grid1, grid2, visit) && res;
        res
    }

    pub fn count_sub_islands(grid1: Vec<Vec<i32>>, grid2: Vec<Vec<i32>>) -> i32 {
        let rows = grid1.len();
        let cols = grid1[0].len();
        let mut visit = HashSet::new();
        let mut count = 0;

        for r in 0..rows {
            for c in 0..cols {
                if grid2[r][c] != 0
                    && !visit.contains(&(r as i32, c as i32))
                    && Self::sub_island_dfs(r as i32, c as i32, &grid1, &grid2, &mut visit)
                {
                    count += 1;
                }
            }
        }
        count
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::count_sub_islands(
                vec![
                    vec![1, 1, 1, 0, 0],
                    vec![0, 1, 1, 1, 1],
                    vec![0, 0, 0, 0, 0],
                    vec![1, 0, 0, 0, 0],
                    vec![1, 1, 0, 1, 1]
                ],
                vec![
                    vec![1, 1, 1, 0, 0],
                    vec![0, 0, 1, 1, 1],
                    vec![0, 1, 0, 0, 0],
                    vec![1, 0, 1, 1, 0],
                    vec![0, 1, 0, 1, 0]
                ]
            ),
            3
        );
        assert_eq!(
            Solution::count_sub_islands(
                vec![
                    vec![1, 0, 1, 0, 1],
                    vec![1, 1, 1, 1, 1],
                    vec![0, 0, 0, 0, 0],
                    vec![1, 1, 1, 1, 1],
                    vec![1, 0, 1, 0, 1]
                ],
                vec![
                    vec![0, 0, 0, 0, 0],
                    vec![1, 1, 1, 1, 1],
                    vec![0, 1, 0, 1, 0],
                    vec![0, 1, 0, 1, 0],
                    vec![1, 0, 0, 0, 1]
                ]
            ),
            2
        );
    }
}
