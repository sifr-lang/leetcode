struct Solution;

impl Solution {
    pub fn find_kth_largest(nums: Vec<i32>, k: i32) -> i32 {
        let pivot = nums[0];
        let mut left = Vec::new();
        let mut mid = Vec::new();
        let mut right = Vec::new();

        for num in nums {
            if num > pivot {
                left.push(num);
            } else if num == pivot {
                mid.push(num);
            } else {
                right.push(num);
            }
        }

        let left_len = left.len() as i32;
        let mid_len = mid.len() as i32;
        if k <= left_len {
            Self::find_kth_largest(left, k)
        } else if k > left_len + mid_len {
            Self::find_kth_largest(right, k - left_len - mid_len)
        } else {
            mid[0]
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::find_kth_largest(vec![3, 2, 1, 5, 6, 4], 2), 5);
        assert_eq!(
            Solution::find_kth_largest(vec![3, 2, 3, 1, 2, 4, 5, 5, 6], 4),
            4
        );
    }
}
