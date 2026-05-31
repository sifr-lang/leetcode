struct Solution;

impl Solution {
    pub fn sum(num1: i32, num2: i32) -> i32 {
        num1 + num2
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn main_asserts() {
        assert_eq!(Solution::sum(12, 5), 17);
        assert_eq!(Solution::sum(-10, 4), -6);
    }
}
