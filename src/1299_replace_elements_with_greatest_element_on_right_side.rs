struct Solution;

use std::cmp::max;

impl Solution {
    pub fn replace_elements(arr: Vec<i32>) -> Vec<i32> {
        let length = arr.len();
        let mut ans: Vec<i32> = vec![-1; length];
        for i in (1..=(length - 1)).rev() {
            ans[i - 1] = max(arr[i], ans[i]);
        }
        ans
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::replace_elements(vec![17, 18, 5, 4, 6, 1]),
            vec![18, 6, 6, 6, 1, -1]
        );
    }
}
