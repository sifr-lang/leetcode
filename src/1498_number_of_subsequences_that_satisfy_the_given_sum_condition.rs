struct Solution;

impl Solution {
    pub fn num_subseq(mut nums: Vec<i32>, target: i32) -> i32 {
        nums.sort();
        let modulo = 1_000_000_007i64;
        let mut powers = vec![1i64; nums.len()];
        for i in 1..nums.len() {
            powers[i] = (powers[i - 1] * 2) % modulo;
        }
        let mut left = 0usize;
        let mut right = nums.len() - 1;
        let mut result = 0i64;
        while left <= right {
            if nums[left] + nums[right] <= target {
                result = (result + powers[right - left]) % modulo;
                left += 1;
            } else if right == 0 {
                break;
            } else {
                right -= 1;
            }
        }
        result as i32
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(Solution::num_subseq(vec![3, 5, 6, 7], 9), 4);
        assert_eq!(Solution::num_subseq(vec![3, 3, 6, 8], 10), 6);
        assert_eq!(Solution::num_subseq(vec![2, 3, 3, 4, 6, 7], 12), 61);
    }
}
