struct Solution;

impl Solution {
    pub fn three_sum_closest(mut nums: Vec<i32>, target: i32) -> i32 {
        nums.sort_unstable();
        let mut best = i32::MAX;

        for i in 0..nums.len().saturating_sub(2) {
            let val = nums[i];
            let mut left = i + 1;
            let mut right = nums.len() - 1;

            while left < right {
                let sum = val + nums[left] + nums[right];
                let current_gap = (target - sum).abs();
                if (best - target).abs() > current_gap {
                    best = sum;
                }
                if sum < target {
                    left += 1;
                } else if sum > target {
                    right -= 1;
                } else {
                    return target;
                }
            }
        }

        best
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::three_sum_closest(vec![-1, 2, 1, -4], 1), 2);
    }
}
