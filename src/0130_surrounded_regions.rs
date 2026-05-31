struct Solution;

use std::collections::HashSet;

impl Solution {
    fn surrounded_dfs(
        r: i32,
        c: i32,
        board: &[Vec<String>],
        flag: &mut HashSet<(i32, i32)>,
        rows: i32,
        cols: i32,
    ) {
        if !(0..rows).contains(&r)
            || !(0..cols).contains(&c)
            || board[r as usize][c as usize] != "O"
            || flag.contains(&(r, c))
        {
            return;
        }
        flag.insert((r, c));
        Self::surrounded_dfs(r + 1, c, board, flag, rows, cols);
        Self::surrounded_dfs(r - 1, c, board, flag, rows, cols);
        Self::surrounded_dfs(r, c + 1, board, flag, rows, cols);
        Self::surrounded_dfs(r, c - 1, board, flag, rows, cols);
    }

    pub fn solve(board: &mut Vec<Vec<String>>) {
        let rows = board.len() as i32;
        let cols = board[0].len() as i32;
        let mut flag = HashSet::new();

        for r in 0..rows {
            for c in 0..cols {
                if (r == 0 || c == 0 || r == rows - 1 || c == cols - 1)
                    && board[r as usize][c as usize] == "O"
                {
                    Self::surrounded_dfs(r, c, board, &mut flag, rows, cols);
                }
            }
        }

        for r in 0..rows {
            for c in 0..cols {
                if board[r as usize][c as usize] == "O" && !flag.contains(&(r, c)) {
                    board[r as usize][c as usize] = "X".to_string();
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut arg0 = vec![
            vec![
                "X".to_string(),
                "X".to_string(),
                "X".to_string(),
                "X".to_string(),
            ],
            vec![
                "X".to_string(),
                "O".to_string(),
                "O".to_string(),
                "X".to_string(),
            ],
            vec![
                "X".to_string(),
                "X".to_string(),
                "O".to_string(),
                "X".to_string(),
            ],
            vec![
                "X".to_string(),
                "O".to_string(),
                "X".to_string(),
                "X".to_string(),
            ],
        ];
        Solution::solve(&mut arg0);
        assert_eq!(
            arg0,
            vec![
                vec![
                    "X".to_string(),
                    "X".to_string(),
                    "X".to_string(),
                    "X".to_string()
                ],
                vec![
                    "X".to_string(),
                    "X".to_string(),
                    "X".to_string(),
                    "X".to_string()
                ],
                vec![
                    "X".to_string(),
                    "X".to_string(),
                    "X".to_string(),
                    "X".to_string()
                ],
                vec![
                    "X".to_string(),
                    "O".to_string(),
                    "X".to_string(),
                    "X".to_string()
                ]
            ]
        );
        let mut arg0 = vec![vec!["X".to_string()]];
        Solution::solve(&mut arg0);
        assert_eq!(arg0, vec![vec!["X".to_string()]]);
    }
}
