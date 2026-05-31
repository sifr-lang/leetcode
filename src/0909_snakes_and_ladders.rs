struct Solution;

use std::collections::{HashSet, VecDeque};

impl Solution {
    fn int_to_pos(square: i32, length: i32) -> (usize, usize) {
        let r = (square - 1) / length;
        let mut c = (square - 1) % length;
        if r % 2 == 1 {
            c = length - 1 - c;
        }
        (r as usize, c as usize)
    }

    pub fn snakes_and_ladders(mut board: Vec<Vec<i32>>) -> i32 {
        let length = board.len() as i32;
        board.reverse();
        let mut q = VecDeque::new();
        q.push_back((1, 0));
        let mut visit = HashSet::new();

        while let Some((square, moves)) = q.pop_front() {
            for i in 1..7 {
                let mut next_square = square + i;
                let (r, c) = Self::int_to_pos(next_square, length);
                if board[r][c] != -1 {
                    next_square = board[r][c];
                }
                if next_square == length * length {
                    return moves + 1;
                }
                if !visit.contains(&next_square) {
                    visit.insert(next_square);
                    q.push_back((next_square, moves + 1));
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
            Solution::snakes_and_ladders(vec![
                vec![-1, -1, -1, -1, -1, -1],
                vec![-1, -1, -1, -1, -1, -1],
                vec![-1, -1, -1, -1, -1, -1],
                vec![-1, 35, -1, -1, 13, -1],
                vec![-1, -1, -1, -1, -1, -1],
                vec![-1, 15, -1, -1, -1, -1]
            ]),
            4
        );
        assert_eq!(
            Solution::snakes_and_ladders(vec![vec![-1, -1], vec![-1, 3]]),
            1
        );
    }
}
