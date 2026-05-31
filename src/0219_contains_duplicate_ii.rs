use std::collections::HashSet;
struct Solution;

impl Solution {
    fn contains_nearby_duplicate(nums: Vec<i32>, k: i32) -> bool {
        let mut window = HashSet::new();
        let mut l = 0;

        for (r, &num) in nums.iter().enumerate() {
            if r as i32 - l as i32 > k {
                window.remove(&nums[l]);
                l += 1;
            }
            if window.contains(&num) {
                return true;
            }
            window.insert(num);
        }
        false
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::contains_nearby_duplicate(vec![1, 2, 3, 1], 3),
            true
        );
        assert_eq!(
            Solution::contains_nearby_duplicate(vec![1, 2, 3, 1, 2, 3], 2),
            false
        );
    }
}
