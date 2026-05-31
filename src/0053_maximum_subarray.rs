struct Solution;

impl Solution {
    pub fn max_sub_array(nums: Vec<i32>) -> i32 {
        let mut res = nums[0];
        let mut sum = 0;

        for n in nums {
            if sum < 0 {
                sum = 0;
            }

            sum += n;
            res = res.max(sum);
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
            Solution::max_sub_array(vec![-2, 1, -3, 4, -1, 2, 1, -5, 4]),
            6
        );
        assert_eq!(Solution::max_sub_array(vec![1]), 1);
        assert_eq!(Solution::max_sub_array(vec![5, 4, -1, 7, 8]), 23);
        assert_eq!(Solution::max_sub_array(vec![-1]), -1);
        assert_eq!(Solution::max_sub_array(vec![-2, -1]), -1);
    }
}
