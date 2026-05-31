struct Solution;

impl Solution {
    pub fn move_zeroes(nums: &mut Vec<i32>) {
        let mut left = 0;

        for r in 0..nums.len() {
            if nums[r] != 0 {
                nums.swap(left, r);
                left += 1;
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        let mut arg0 = vec![0, 1, 0, 3, 12];
        Solution::move_zeroes(&mut arg0);
        assert_eq!(arg0, vec![1, 3, 12, 0, 0]);
        let mut arg0 = vec![0];
        Solution::move_zeroes(&mut arg0);
        assert_eq!(arg0, vec![0]);
    }
}
