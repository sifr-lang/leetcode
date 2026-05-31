struct Solution;

impl Solution {
    pub fn num_subarrays_with_sum(nums: Vec<i32>, goal: i32) -> i32 {
        Self::helper(&nums, goal) - Self::helper(&nums, goal - 1)
    }

    fn helper(nums: &[i32], x: i32) -> i32 {
        if x < 0 {
            return 0;
        }

        let mut res = 0;
        let mut l = 0usize;
        let mut cur = 0;
        for r in 0..nums.len() {
            cur += nums[r];
            while cur > x {
                cur -= nums[l];
                l += 1;
            }
            res += (r - l + 1) as i32;
        }
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::num_subarrays_with_sum(vec![1, 0, 1, 0, 1], 2), 4);
    }
}
