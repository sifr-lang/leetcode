struct Solution;

impl Solution {
    pub fn first_missing_positive(mut nums: Vec<i32>) -> i32 {
        for value in &mut nums {
            if *value < 0 {
                *value = 0;
            }
        }

        for i in 0..nums.len() {
            let val = nums[i].abs();
            if 1 <= val && val <= nums.len() as i32 {
                let index = val as usize - 1;
                if nums[index] > 0 {
                    nums[index] *= -1;
                } else if nums[index] == 0 {
                    nums[index] = -1 * (nums.len() as i32 + 1);
                }
            }
        }

        for i in 1..=nums.len() {
            if nums[i - 1] >= 0 {
                return i as i32;
            }
        }

        nums.len() as i32 + 1
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::first_missing_positive(vec![1, 2, 0]), 3);
        assert_eq!(Solution::first_missing_positive(vec![3, 4, -1, 1]), 2);
        assert_eq!(Solution::first_missing_positive(vec![7, 8, 9, 11, 12]), 1);
    }
}
