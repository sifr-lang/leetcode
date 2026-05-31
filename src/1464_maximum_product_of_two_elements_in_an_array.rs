struct Solution;

impl Solution {
    pub fn max_product(nums: Vec<i32>) -> i32 {
        let mut high = 0;
        let mut second_high = 0;

        for n in nums {
            if n > high {
                second_high = high;
                high = n;
            } else {
                second_high = second_high.max(n);
            }
        }

        (high - 1) * (second_high - 1)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::max_product(vec![3, 4, 5, 2]), 12);
        assert_eq!(Solution::max_product(vec![1, 5, 4, 5]), 16);
    }
}
