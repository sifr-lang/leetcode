struct Solution;

use std::collections::HashSet;

impl Solution {
    pub fn find_difference(nums1: Vec<i32>, nums2: Vec<i32>) -> Vec<Vec<i32>> {
        let s1: HashSet<i32> = nums1.into_iter().collect();
        let s2: HashSet<i32> = nums2.into_iter().collect();

        let mut r1 = Vec::new();
        let mut r2 = Vec::new();

        for n in &s1 {
            if !s2.contains(n) {
                r1.push(*n);
            }
        }

        for n in &s2 {
            if !s1.contains(n) {
                r2.push(*n);
            }
        }

        r1.sort();
        r2.sort();

        vec![r1, r2]
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::find_difference(vec![1, 2, 3], vec![2, 4, 6]),
            vec![vec![1, 3], vec![4, 6]]
        );
        assert_eq!(
            Solution::find_difference(vec![1, 2, 3, 3], vec![1, 1, 2, 2]),
            vec![vec![3], vec![]]
        );
    }
}
