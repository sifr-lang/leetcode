struct Solution;

impl Solution {
    pub fn final_prices(prices: Vec<i32>) -> Vec<i32> {
        let mut stack = Vec::new();
        let mut res = Vec::new();

        for i in (0..prices.len()).rev() {
            if stack.is_empty() {
                res.push(prices[i]);
            } else if *stack.last().unwrap() <= prices[i] {
                res.push(prices[i] - stack.last().unwrap());
            } else {
                while !stack.is_empty() && *stack.last().unwrap() > prices[i] {
                    stack.pop();
                }
                if stack.is_empty() {
                    res.push(prices[i]);
                } else {
                    res.push(prices[i] - stack.last().unwrap());
                }
            }
            stack.push(prices[i]);
        }

        res.reverse();
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::final_prices(vec![8, 4, 6, 2, 3]),
            vec![4, 2, 4, 2, 3]
        );
    }
}
