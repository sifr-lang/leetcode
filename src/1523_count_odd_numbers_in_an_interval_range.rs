struct Solution;

impl Solution {
    pub fn count_odds(low: i32, high: i32) -> i32 {
        (high + 1) / 2 - low / 2
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::count_odds(3, 7), 3);
        assert_eq!(Solution::count_odds(8, 10), 1);
    }
}
