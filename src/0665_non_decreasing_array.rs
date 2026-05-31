struct Solution;

impl Solution {
    pub fn check_possibility(mut nums: Vec<i32>) -> bool {
        if nums.len() <= 2 {
            return true;
        }

        let mut changed = false;
        for i in 0..nums.len() {
            if i == nums.len() - 1 || nums[i] <= nums[i + 1] {
                continue;
            }
            if changed {
                return false;
            }
            if i == 0 || nums[i + 1] >= nums[i - 1] {
                nums[i] = nums[i + 1];
            } else {
                nums[i + 1] = nums[i];
            }
            changed = true;
        }

        true
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::check_possibility(vec![4, 2, 3]), true);
        assert_eq!(Solution::check_possibility(vec![4, 2, 1]), false);
    }
}
