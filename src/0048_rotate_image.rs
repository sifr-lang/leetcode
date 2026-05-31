struct Solution;

impl Solution {
    pub fn rotate(matrix: &mut [Vec<i32>]) {
        matrix.reverse();
        let len = matrix.len();
        for i in 0..len {
            for j in i..len {
                let x = matrix[i][j];
                let y = matrix[j][i];
                matrix[j][i] = x;
                matrix[i][j] = y;
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut arg0 = vec![vec![1, 2, 3], vec![4, 5, 6], vec![7, 8, 9]];
        Solution::rotate(&mut arg0);
        assert_eq!(arg0, vec![vec![7, 4, 1], vec![8, 5, 2], vec![9, 6, 3]]);
        let mut arg0 = vec![
            vec![5, 1, 9, 11],
            vec![2, 4, 8, 10],
            vec![13, 3, 6, 7],
            vec![15, 14, 12, 16],
        ];
        Solution::rotate(&mut arg0);
        assert_eq!(
            arg0,
            vec![
                vec![15, 13, 2, 5],
                vec![14, 3, 4, 1],
                vec![12, 6, 8, 9],
                vec![16, 7, 10, 11]
            ]
        );
    }
}
