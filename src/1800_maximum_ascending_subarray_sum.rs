struct Solution;

impl Solution {
    pub fn max_ascending_sum(nums: Vec<i32>) -> i32 {
        let mut cur_sum = nums[0];
        let mut results = nums[0];

        for i in 1..nums.len() {
            if nums[i] <= nums[i - 1] {
                cur_sum = 0;
            }
            cur_sum += nums[i];
            results = results.max(cur_sum);
        }

        results
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn main_asserts() {
        assert_eq!(Solution::max_ascending_sum(vec![10, 20, 30, 5, 10, 50]), 65);
    }
}
