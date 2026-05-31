struct Solution;

impl Solution {
    pub fn min_sub_array_len(target: i32, nums: Vec<i32>) -> i32 {
        let mut left = 0usize;
        let mut total = 0;
        let mut best = usize::MAX;
        for right in 0..nums.len() {
            total += nums[right];
            while total >= target {
                best = best.min(right - left + 1);
                total -= nums[left];
                left += 1;
            }
        }
        if best == usize::MAX {
            0
        } else {
            best as i32
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(Solution::min_sub_array_len(7, vec![2, 3, 1, 2, 4, 3]), 2);
        assert_eq!(Solution::min_sub_array_len(4, vec![1, 4, 4]), 1);
        assert_eq!(
            Solution::min_sub_array_len(11, vec![1, 1, 1, 1, 1, 1, 1, 1]),
            0
        );
    }
}
