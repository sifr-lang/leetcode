struct Solution;

impl Solution {
    fn legal(
        mut row: i32,
        mut col: i32,
        color: char,
        direc: [i32; 2],
        board: &[Vec<char>],
        rows: i32,
        cols: i32,
    ) -> bool {
        let [dr, dc] = direc;
        row += dr;
        col += dc;
        let mut length = 1;

        while (0..rows).contains(&row) && (0..cols).contains(&col) {
            length += 1;
            if board[row as usize][col as usize] == '.' {
                return false;
            }
            if board[row as usize][col as usize] == color {
                return length >= 3;
            }
            row += dr;
            col += dc;
        }
        false
    }

    pub fn check_move(mut board: Vec<Vec<char>>, r_move: i32, c_move: i32, color: String) -> bool {
        let rows = board.len() as i32;
        let cols = board[0].len() as i32;
        let color = color.chars().next().unwrap();
        let direction = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
            [1, 1],
            [-1, -1],
            [1, -1],
            [-1, 1],
        ];
        board[r_move as usize][c_move as usize] = color;

        for d in direction {
            if Self::legal(r_move, c_move, color, d, &board, rows, cols) {
                return true;
            }
        }
        false
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::check_move(
                vec![
                    vec!['.', '.', '.', 'B', '.', '.', '.', '.'],
                    vec!['.', '.', '.', 'W', '.', '.', '.', '.'],
                    vec!['.', '.', '.', 'W', '.', '.', '.', '.'],
                    vec!['.', '.', '.', 'W', '.', '.', '.', '.'],
                    vec!['W', 'B', 'B', '.', 'W', 'W', 'W', 'B'],
                    vec!['.', '.', '.', 'B', '.', '.', '.', '.'],
                    vec!['.', '.', '.', 'B', '.', '.', '.', '.'],
                    vec!['.', '.', '.', 'W', '.', '.', '.', '.']
                ],
                4,
                3,
                "B".to_string()
            ),
            true
        );
        assert_eq!(
            Solution::check_move(
                vec![
                    vec!['.', '.', '.', '.', '.', '.', '.', '.'],
                    vec!['.', 'B', '.', '.', 'W', '.', '.', '.'],
                    vec!['.', '.', 'W', '.', '.', '.', '.', '.'],
                    vec!['.', '.', '.', 'W', 'B', '.', '.', '.'],
                    vec!['.', '.', '.', '.', '.', '.', '.', '.'],
                    vec!['.', '.', '.', '.', 'B', 'W', '.', '.'],
                    vec!['.', '.', '.', '.', '.', '.', 'W', '.'],
                    vec!['.', '.', '.', '.', '.', '.', '.', 'B']
                ],
                4,
                4,
                "W".to_string()
            ),
            false
        );
    }
}
