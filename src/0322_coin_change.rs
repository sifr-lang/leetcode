struct Solution;

impl Solution {
    pub fn coin_change(coins: Vec<i32>, amount: i32) -> i32 {
        let mut change = vec![amount + 1; (amount + 1) as usize];
        change[0] = 0;
        for a in 1..=amount {
            for c in &coins {
                if a - c >= 0 {
                    change[a as usize] = change[a as usize].min(1 + change[(a - c) as usize]);
                }
            }
        }
        if change[amount as usize] == amount + 1 {
            return -1;
        }
        change[amount as usize]
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::coin_change(vec![1, 2, 5], 11), 3);
        assert_eq!(Solution::coin_change(vec![2], 3), -1);
        assert_eq!(Solution::coin_change(vec![1], 0), 0);
    }
}
