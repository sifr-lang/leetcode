struct Solution;

use std::collections::HashSet;

impl Solution {
    pub fn is_valid_sudoku(board: Vec<Vec<char>>) -> bool {
        let mut row: HashSet<char> = HashSet::new();
        let mut col: HashSet<char> = HashSet::new();
        let mut bx: HashSet<char> = HashSet::new();

        for i in 0..9 {
            for j in 0..9 {
                let r = board[i][j];
                let c = board[j][i];
                let b = board[i / 3 * 3 + j / 3][i % 3 * 3 + j % 3];

                if r != '.' {
                    if !row.insert(r) {
                        return false;
                    }
                }

                if c != '.' {
                    if !col.insert(c) {
                        return false;
                    }
                }

                if b != '.' {
                    if !bx.insert(b) {
                        return false;
                    }
                }
            }

            row.clear();
            col.clear();
            bx.clear();
        }

        true
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let valid_board = vec![
            vec!['5', '3', '.', '.', '7', '.', '.', '.', '.'],
            vec!['6', '.', '.', '1', '9', '5', '.', '.', '.'],
            vec!['.', '9', '8', '.', '.', '.', '.', '6', '.'],
            vec!['8', '.', '.', '.', '6', '.', '.', '.', '3'],
            vec!['4', '.', '.', '8', '.', '3', '.', '.', '1'],
            vec!['7', '.', '.', '.', '2', '.', '.', '.', '6'],
            vec!['.', '6', '.', '.', '.', '.', '2', '8', '.'],
            vec!['.', '.', '.', '4', '1', '9', '.', '.', '5'],
            vec!['.', '.', '.', '.', '8', '.', '.', '7', '9'],
        ];
        let invalid_board = vec![
            vec!['8', '3', '.', '.', '7', '.', '.', '.', '.'],
            vec!['6', '.', '.', '1', '9', '5', '.', '.', '.'],
            vec!['.', '9', '8', '.', '.', '.', '.', '6', '.'],
            vec!['8', '.', '.', '.', '6', '.', '.', '.', '3'],
            vec!['4', '.', '.', '8', '.', '3', '.', '.', '1'],
            vec!['7', '.', '.', '.', '2', '.', '.', '.', '6'],
            vec!['.', '6', '.', '.', '.', '.', '2', '8', '.'],
            vec!['.', '.', '.', '4', '1', '9', '.', '.', '5'],
            vec!['.', '.', '.', '.', '8', '.', '.', '7', '9'],
        ];
        assert_eq!(Solution::is_valid_sudoku(valid_board.clone()), true);
        assert_eq!(Solution::is_valid_sudoku(invalid_board.clone()), false);
    }
}
