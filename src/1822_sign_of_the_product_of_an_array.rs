struct Solution;

impl Solution {
    pub fn array_sign(nums: Vec<i32>) -> i32 {
        let mut neg = 0;

        for n in nums {
            if n == 0 {
                return 0;
            } else if n < 0 {
                neg += 1;
            }
        }

        if neg % 2 == 0 {
            return 1;
        }

        -1
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::array_sign(vec![-1, -2, -3, -4, 3, 2, 1]), 1);
        assert_eq!(Solution::array_sign(vec![1, 5, 0, 2, -3]), 0);
        assert_eq!(Solution::array_sign(vec![-1, 1, -1, 1, -1]), -1);
    }
}
