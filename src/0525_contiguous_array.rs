use std::collections::HashMap;

struct Solution;

impl Solution {
    pub fn find_max_length(nums: Vec<i32>) -> i32 {
        let mut zero = 0;
        let mut one = 0;
        let mut res = 0;
        let mut diff_index = HashMap::new();

        for (i, num) in nums.into_iter().enumerate() {
            if num == 0 {
                zero += 1;
            } else {
                one += 1;
            }

            let diff = one - zero;
            diff_index.entry(diff).or_insert(i as i32);

            if one == zero {
                res = one + zero;
            } else {
                let idx = diff_index[&diff];
                res = res.max(i as i32 - idx);
            }
        }

        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::find_max_length(vec![0, 1]), 2);
        assert_eq!(Solution::find_max_length(vec![0, 1, 0]), 2);
    }
}
