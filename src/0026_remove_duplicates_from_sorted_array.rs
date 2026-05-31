struct Solution;

impl Solution {
    pub fn remove_duplicates(nums: &mut Vec<i32>) -> i32 {
        let mut dup_count = 0;

        for i in 1..nums.len() {
            if nums[i] == nums[i - 1] {
                dup_count += 1
            }

            nums[i - dup_count] = nums[i];
        }

        (nums.len() - dup_count) as i32
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(
            {
                let mut arg0 = vec![1, 1, 2];
                Solution::remove_duplicates(&mut arg0)
            },
            2
        );
        assert_eq!(
            {
                let mut arg0 = vec![0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
                Solution::remove_duplicates(&mut arg0)
            },
            5
        );
    }
}
