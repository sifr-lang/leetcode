/*
 * @lc app=leetcode id=912 lang=rust
 *
 * [912] Sort an Array
 */
struct Solution;
// @lc code=start
impl Solution {
    pub fn sort_array(mut nums: Vec<i32>) -> Vec<i32> {
        nums.sort();
        nums
    }
}
// @lc code=end
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::sort_array(vec![5, 2, 3, 1]), vec![1, 2, 3, 5]);
    }
}
