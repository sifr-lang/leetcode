struct Solution;

use std::collections::HashMap;

impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        let mut map = HashMap::new();

        for (i, n) in nums.into_iter().enumerate() {
            let diff = target - n;

            if let Some(&j) = map.get(&diff) {
                return vec![j as i32, i as i32];
            } else {
                map.insert(n, i);
            }
        }

        unreachable!()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::two_sum(vec![2, 7, 11, 15], 9), vec![0, 1]);
        assert_eq!(Solution::two_sum(vec![3, 2, 4], 6), vec![1, 2]);
        assert_eq!(Solution::two_sum(vec![3, 3], 6), vec![0, 1]);
    }
}
