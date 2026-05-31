struct Solution;

use std::collections::HashSet;

impl Solution {
    fn perimeter_dfs(i: i32, j: i32, grid: &[Vec<i32>], visit: &mut HashSet<(i32, i32)>) -> i32 {
        if i >= grid.len() as i32
            || j >= grid[0].len() as i32
            || i < 0
            || j < 0
            || grid[i as usize][j as usize] == 0
        {
            return 1;
        }
        if visit.contains(&(i, j)) {
            return 0;
        }

        visit.insert((i, j));
        let mut perim = Self::perimeter_dfs(i, j + 1, grid, visit);
        perim += Self::perimeter_dfs(i + 1, j, grid, visit);
        perim += Self::perimeter_dfs(i, j - 1, grid, visit);
        perim += Self::perimeter_dfs(i - 1, j, grid, visit);
        perim
    }

    pub fn island_perimeter(grid: Vec<Vec<i32>>) -> i32 {
        let mut visit = HashSet::new();
        for i in 0..grid.len() {
            for j in 0..grid[0].len() {
                if grid[i][j] != 0 {
                    return Self::perimeter_dfs(i as i32, j as i32, &grid, &mut visit);
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
            Solution::island_perimeter(vec![
                vec![0, 1, 0, 0],
                vec![1, 1, 1, 0],
                vec![0, 1, 0, 0],
                vec![1, 1, 0, 0]
            ]),
            16
        );
        assert_eq!(Solution::island_perimeter(vec![vec![1]]), 4);
        assert_eq!(Solution::island_perimeter(vec![vec![1, 0]]), 4);
    }
}
