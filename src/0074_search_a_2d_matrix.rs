struct Solution;

use std::cmp::Ordering::{Equal, Greater, Less};

impl Solution {
    pub fn search_matrix(matrix: Vec<Vec<i32>>, target: i32) -> bool {
        let (mut t, mut b) = (0, matrix.len());
        let mut row = 0;
        while t < b {
            row = t + (b - t) / 2;
            let first = matrix[row][0];
            let last = *matrix[row].last().unwrap();
            if target == first || target == last {
                return true;
            } else if target < first {
                b = row;
            } else if target > last {
                t = row + 1;
            } else {
                break;
            }
        }

        if t > b {
            return false;
        }

        let (mut l, mut r) = (0, matrix[row].len());
        while l < r {
            let col = l + (r - l) / 2;
            match target.cmp(&matrix[row][col]) {
                Equal => return true,
                Less => r = col,
                Greater => l = col + 1,
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
            Solution::search_matrix(
                vec![vec![1, 3, 5, 7], vec![10, 11, 16, 20], vec![23, 30, 34, 60]],
                3
            ),
            true
        );
        assert_eq!(
            Solution::search_matrix(
                vec![vec![1, 3, 5, 7], vec![10, 11, 16, 20], vec![23, 30, 34, 60]],
                13
            ),
            false
        );
    }
}
