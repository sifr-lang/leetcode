struct Solution;

use std::collections::HashSet;

impl Solution {
    fn closed_dfs(
        x: i32,
        y: i32,
        grid: &mut Vec<Vec<i32>>,
        seen: &mut HashSet<(i32, i32)>,
        r: i32,
        c: i32,
    ) {
        if x < 0
            || x >= r
            || y < 0
            || y >= c
            || seen.contains(&(x, y))
            || grid[x as usize][y as usize] == 1
        {
            return;
        }
        seen.insert((x, y));
        grid[x as usize][y as usize] = 1;
        Self::closed_dfs(x + 1, y, grid, seen, r, c);
        Self::closed_dfs(x, y + 1, grid, seen, r, c);
        Self::closed_dfs(x - 1, y, grid, seen, r, c);
        Self::closed_dfs(x, y - 1, grid, seen, r, c);
    }

    pub fn closed_island(mut grid: Vec<Vec<i32>>) -> i32 {
        let r = grid.len() as i32;
        let c = grid[0].len() as i32;
        let mut seen = HashSet::new();

        for i in 0..r {
            for j in 0..c {
                if i == 0 || j == 0 || i == r - 1 || j == c - 1 {
                    Self::closed_dfs(i, j, &mut grid, &mut seen, r, c);
                }
            }
        }

        let mut ans = 0;
        for i in 0..r {
            for j in 0..c {
                if grid[i as usize][j as usize] == 0 {
                    Self::closed_dfs(i, j, &mut grid, &mut seen, r, c);
                    ans += 1;
                }
            }
        }
        ans
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::closed_island(vec![
                vec![1, 1, 1, 1, 1, 1, 1, 0],
                vec![1, 0, 0, 0, 0, 1, 1, 0],
                vec![1, 0, 1, 0, 1, 1, 1, 0],
                vec![1, 0, 0, 0, 0, 1, 0, 1],
                vec![1, 1, 1, 1, 1, 1, 1, 0]
            ]),
            2
        );
        assert_eq!(
            Solution::closed_island(vec![
                vec![0, 0, 1, 0, 0],
                vec![0, 1, 0, 1, 0],
                vec![0, 1, 1, 1, 0]
            ]),
            1
        );
        assert_eq!(
            Solution::closed_island(vec![
                vec![1, 1, 1, 1, 1, 1, 1],
                vec![1, 0, 0, 0, 0, 0, 1],
                vec![1, 0, 1, 1, 1, 0, 1],
                vec![1, 0, 1, 0, 1, 0, 1],
                vec![1, 0, 1, 1, 1, 0, 1],
                vec![1, 0, 0, 0, 0, 0, 1],
                vec![1, 1, 1, 1, 1, 1, 1]
            ]),
            2
        );
    }
}
