struct Solution;

use std::cmp::Ordering::{Equal, Greater, Less};

impl Solution {
    pub fn search(nums: Vec<i32>, target: i32) -> i32 {
        let (mut l, mut r) = (0, nums.len());

        while l < r {
            let m = l + (r - l) / 2;
            match target.cmp(&nums[m]) {
                Equal => return m as i32,
                Less => r = m,
                Greater => l = m + 1,
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
        assert_eq!(Solution::search(vec![-1, 0, 3, 5, 9, 12], 9), 4);
        assert_eq!(Solution::search(vec![-1, 0, 3, 5, 9, 12], 2), -1);
        assert_eq!(Solution::search(vec![5], 5), 0);
        assert_eq!(Solution::search(vec![2, 5], 5), 1);
    }
}
