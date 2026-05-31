struct Solution;

impl Solution {
    pub fn max_frequency(mut nums: Vec<i32>, k: i32) -> i32 {
        let (mut left, mut right, mut res, mut total) = (0, 0, 0, 0);

        nums.sort_unstable();

        while right < nums.len() {
            total += nums[right];

            while (nums[right] * (right - left + 1) as i32) - total > k {
                total -= nums[left];
                left += 1;
            }

            res = res.max(right - left + 1);
            right += 1;
        }

        res as i32
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(Solution::max_frequency(vec![1, 2, 4], 5), 3);
        assert_eq!(Solution::max_frequency(vec![1, 4, 8, 13], 5), 2);
        assert_eq!(Solution::max_frequency(vec![3, 9, 6], 2), 1);
    }
}
