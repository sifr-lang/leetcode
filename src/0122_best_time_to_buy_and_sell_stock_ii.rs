struct Solution;

impl Solution {
    pub fn max_profit(prices: Vec<i32>) -> i32 {
        let mut buy = i32::MAX;
        let mut sell = 0;
        for p in prices {
            buy = std::cmp::min(buy, p - sell);
            sell = std::cmp::max(sell, p - buy);
        }

        return sell;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::max_profit(vec![7, 1, 5, 3, 6, 4]), 7);
        assert_eq!(Solution::max_profit(vec![1, 2, 3, 4, 5]), 4);
        assert_eq!(Solution::max_profit(vec![7, 6, 4, 3, 1]), 0);
    }
}
