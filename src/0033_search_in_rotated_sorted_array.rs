struct Solution;

impl Solution {
    pub fn search(nums: Vec<i32>, target: i32) -> i32 {
        let (mut l, mut r) = (0, nums.len() - 1);

        while l <= r {
            let m = (l + r) / 2;

            if nums[m] == target {
                return m as i32;
            }

            if nums[l] <= nums[m] {
                if target < nums[l] || target > nums[m] {
                    l = m + 1;
                } else {
                    r = m - 1;
                }
            } else {
                if target < nums[m] || target > nums[r] {
                    r = m - 1;
                } else {
                    l = m + 1;
                }
            }
        }

        -1
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::search(vec![4, 5, 6, 7, 0, 1, 2], 0), 4);
        assert_eq!(Solution::search(vec![4, 5, 6, 7, 0, 1, 2], 3), -1);
        assert_eq!(Solution::search(vec![1], 0), -1);
    }
}
