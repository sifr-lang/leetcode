struct Solution;

impl Solution {
    pub fn product_except_self(mut nums: Vec<i32>) -> Vec<i32> {
        let mut res = vec![1; nums.len()];

        for i in (1..nums.len()) {
            res[i] = nums[i - 1] * res[i - 1];
        }

        let mut right = 1;

        for (i, n) in res.iter_mut().enumerate().rev() {
            *n = *n * right;
            right *= nums[i];
        }

        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::product_except_self(vec![1, 2, 3, 4]),
            vec![24, 12, 8, 6]
        );
        assert_eq!(
            Solution::product_except_self(vec![-1, 1, 0, -3, 3]),
            vec![0, 0, 9, 0, 0]
        );
        assert_eq!(Solution::product_except_self(vec![2, 3]), vec![3, 2]);
    }
}
