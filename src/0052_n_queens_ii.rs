struct Solution;

use std::collections::HashSet;

impl Solution {
    fn n_queens_backtrack(
        i: i32,
        n: i32,
        answer: &mut i32,
        cols: &mut HashSet<i32>,
        posdiag: &mut HashSet<i32>,
        negdiag: &mut HashSet<i32>,
    ) {
        if i == n {
            *answer += 1;
            return;
        }

        for j in 0..n {
            if cols.contains(&j) || posdiag.contains(&(i + j)) || negdiag.contains(&(i - j)) {
                continue;
            }

            cols.insert(j);
            posdiag.insert(i + j);
            negdiag.insert(i - j);

            Self::n_queens_backtrack(i + 1, n, answer, cols, posdiag, negdiag);

            cols.remove(&j);
            posdiag.remove(&(i + j));
            negdiag.remove(&(i - j));
        }
    }

    pub fn total_n_queens(n: i32) -> i32 {
        let mut answer = 0;
        let mut cols = HashSet::new();
        let mut posdiag = HashSet::new();
        let mut negdiag = HashSet::new();
        Self::n_queens_backtrack(0, n, &mut answer, &mut cols, &mut posdiag, &mut negdiag);
        answer
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::total_n_queens(4), 2);
        assert_eq!(Solution::total_n_queens(1), 1);
    }
}
