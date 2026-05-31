struct Solution;

impl Solution {
    pub fn num_special(mat: Vec<Vec<i32>>) -> i32 {
        let m = mat.len();
        let n = mat[0].len();
        let mut row_count = vec![0; m];
        let mut col_count = vec![0; n];
        let mut res = 0;

        for r in 0..m {
            for c in 0..n {
                if mat[r][c] == 1 {
                    row_count[r] += 1;
                    col_count[c] += 1;
                }
            }
        }

        for r in 0..m {
            for c in 0..n {
                if mat[r][c] == 1 && row_count[r] == 1 && col_count[c] == 1 {
                    res += 1;
                }
            }
        }

        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::num_special(vec![vec![1, 0, 0], vec![0, 0, 1], vec![1, 0, 0]]),
            1
        );
        assert_eq!(
            Solution::num_special(vec![vec![1, 0, 0], vec![0, 1, 0], vec![0, 0, 1]]),
            3
        );
    }
}
