struct Solution;

impl Solution {
    pub fn min_operations(nums: Vec<i32>, x: i32) -> i32 {
        let target: i32 = nums.iter().sum::<i32>() - x;
        if target < 0 {
            return -1;
        }
        let mut left = 0usize;
        let mut total = 0;
        let mut best = -1;
        for right in 0..nums.len() {
            total += nums[right];
            while total > target && left <= right {
                total -= nums[left];
                left += 1;
            }
            if total == target {
                best = best.max((right - left + 1) as i32);
            }
        }
        if best == -1 {
            -1
        } else {
            nums.len() as i32 - best
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(Solution::min_operations(vec![1, 1, 4, 2, 3], 5), 2);
        assert_eq!(Solution::min_operations(vec![5, 6, 7, 8, 9], 4), -1);
    }
}
