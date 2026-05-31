struct Solution;

impl Solution {
    pub fn num_islands(mut grid: Vec<Vec<char>>) -> i32 {
        fn dfs(grid: &mut Vec<Vec<char>>, x: i32, y: i32) {
            if x < 0
                || y < 0
                || x >= grid.len() as i32
                || y >= grid[0].len() as i32
                || grid[x as usize][y as usize] == '0'
            {
                return;
            }

            grid[x as usize][y as usize] = '0';

            let directions: [(i32, i32); 4] = [(0, 1), (1, 0), (0, -1), (-1, 0)];

            for (add_x, add_y) in directions {
                dfs(grid, x + add_x, y + add_y);
            }
        }

        let mut count = 0;
        for x in 0..grid.len() {
            for y in 0..grid[0].len() {
                if grid[x][y] == '1' {
                    count += 1;
                    dfs(&mut grid, x as i32, y as i32);
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
            Solution::num_islands(vec![
                vec!['1', '1', '1', '1', '0'],
                vec!['1', '1', '0', '1', '0'],
                vec!['1', '1', '0', '0', '0'],
                vec!['0', '0', '0', '0', '0']
            ]),
            1
        );
        assert_eq!(
            Solution::num_islands(vec![
                vec!['1', '1', '0', '0', '0'],
                vec!['1', '1', '0', '0', '0'],
                vec!['0', '0', '1', '0', '0'],
                vec!['0', '0', '0', '1', '1']
            ]),
            3
        );
    }
}
