use std::cmp;

struct Solution;

impl Solution {
    pub fn max_profit(prices: Vec<i32>) -> i32 {
        let mut l = 0;
        let mut r = 1;
        let mut max_profit = 0;

        while r < prices.len() {
            if prices[l] < prices[r] {
                let profit = prices[r] - prices[l];
                max_profit = cmp::max(profit, max_profit);
            } else {
                l = r;
            }
            r += 1;
        }

        max_profit
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(Solution::max_profit(vec![7, 1, 5, 3, 6, 4]), 5);
        assert_eq!(Solution::max_profit(vec![7, 6, 4, 3, 1]), 0);
        assert_eq!(Solution::max_profit(vec![2, 4, 1]), 2);
        assert_eq!(Solution::max_profit(vec![1, 2]), 1);
    }
}
