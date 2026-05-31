struct Solution;

impl Solution {
    pub fn is_power_of_two(n: i32) -> bool {
        n > 0 && ((1_i64 << 30) % i64::from(n)) == 0
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::is_power_of_two(1), true);
        assert_eq!(Solution::is_power_of_two(16), true);
        assert_eq!(Solution::is_power_of_two(3), false);
    }
}
