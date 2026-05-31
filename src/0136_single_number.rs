struct Solution;

impl Solution {
    pub fn single_number(nums: Vec<i32>) -> i32 {
        let mut res = 0;
        for n in nums {
            res ^= n;
        }
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::single_number(vec![2, 2, 1]), 1);
        assert_eq!(Solution::single_number(vec![4, 1, 2, 1, 2]), 4);
    }
}
