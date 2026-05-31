struct Solution;

impl Solution {
    pub fn zero_filled_subarray(nums: Vec<i32>) -> i32 {
        let mut res = nums.iter().filter(|&&value| value == 0).count() as i32;
        if res == 0 {
            return 0;
        }

        let mut r = 0;
        let l = nums.len();
        while r < l {
            let mut temp_subarray = Vec::new();
            while r < l && nums[r] == 0 {
                temp_subarray.push(nums[r]);
                r += 1;
            }
            if temp_subarray.len() > 1 {
                let temp_count = temp_subarray.len() * (temp_subarray.len() - 1) / 2;
                res += temp_count as i32;
            }
            r += 1;
        }

        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::zero_filled_subarray(vec![1, 3, 0, 0, 2, 0, 0, 4]),
            6
        );
        assert_eq!(Solution::zero_filled_subarray(vec![0, 0, 0, 2, 0, 0]), 9);
    }
}
