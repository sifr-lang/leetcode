struct Solution;

impl Solution {
    pub fn spiral_order(matrix: Vec<Vec<i32>>) -> Vec<i32> {
        let (mut top, mut bottom) = (0i32, matrix.len() as i32 - 1);
        let (mut left, mut right) = (0i32, matrix[0].len() as i32 - 1);
        let mut result = Vec::new();
        while left <= right && top <= bottom {
            for col in left..=right {
                result.push(matrix[top as usize][col as usize]);
            }
            top += 1;
            for row in top..=bottom {
                result.push(matrix[row as usize][right as usize]);
            }
            right -= 1;
            if top <= bottom {
                for col in (left..=right).rev() {
                    result.push(matrix[bottom as usize][col as usize]);
                }
                bottom -= 1;
            }
            if left <= right {
                for row in (top..=bottom).rev() {
                    result.push(matrix[row as usize][left as usize]);
                }
                left += 1;
            }
        }
        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::spiral_order(vec![vec![1, 2, 3], vec![4, 5, 6], vec![7, 8, 9]]),
            vec![1, 2, 3, 6, 9, 8, 7, 4, 5]
        );
    }
}
