pub struct NumMatrix {
    sum_: Vec<Vec<i32>>,
}

impl NumMatrix {
    pub fn new(matrix: Vec<Vec<i32>>) -> Self {
        let mut sum_ = vec![vec![0; matrix[0].len() + 1]; matrix.len() + 1];

        for (i, line) in matrix.iter().enumerate() {
            let mut previous = 0;
            for (j, &num) in line.iter().enumerate() {
                previous += num;
                let above = sum_[i][j + 1];
                sum_[i + 1][j + 1] = previous + above;
            }
        }

        Self { sum_ }
    }

    pub fn sum_region(&self, row1: i32, col1: i32, row2: i32, col2: i32) -> i32 {
        let row1 = row1 as usize;
        let col1 = col1 as usize;
        let row2 = row2 as usize;
        let col2 = col2 as usize;
        let sum_col2 = self.sum_[row2 + 1][col2 + 1] - self.sum_[row1][col2 + 1];
        let sum_col1 = self.sum_[row2 + 1][col1] - self.sum_[row1][col1];
        sum_col2 - sum_col1
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut obj = NumMatrix::new(vec![
            vec![3, 0, 1, 4, 2],
            vec![5, 6, 3, 2, 1],
            vec![1, 2, 0, 1, 5],
            vec![4, 1, 0, 1, 7],
            vec![1, 0, 3, 0, 5],
        ]);
        assert_eq!(obj.sum_region(2, 1, 4, 3), 8);
        assert_eq!(obj.sum_region(1, 1, 2, 2), 11);
        assert_eq!(obj.sum_region(1, 2, 2, 4), 12);
    }
}
