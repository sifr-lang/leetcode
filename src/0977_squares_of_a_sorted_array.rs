struct Solution;

impl Solution {
    pub fn sorted_squares(nums: Vec<i32>) -> Vec<i64> {
        let mut sq: Vec<i64> = vec![0; nums.len()];
        let mut i = nums.len() as isize - 1;
        let mut l = 0;
        let mut r = nums.len() as isize - 1;

        while l <= r {
            let left = i64::from(nums[l as usize].abs());
            let right = i64::from(nums[r as usize].abs());
            if left > right {
                sq[i as usize] = left * left;
                l += 1;
            } else {
                sq[i as usize] = right * right;
                r -= 1;
            }
            i -= 1;
        }

        sq
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::sorted_squares(vec![-4, -1, 0, 3, 10]),
            vec![0, 1, 9, 16, 100]
        );
    }
}
