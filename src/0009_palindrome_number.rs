struct Solution;

impl Solution {
    pub fn is_palindrome(x: i64) -> bool {
        let numbers = x.to_string();
        let numbers = numbers.as_bytes();

        let (mut left, mut right) = (0, numbers.len() - 1);

        while left < right {
            if numbers[left] != numbers[right] {
                return false;
            }
            left += 1;
            right -= 1;
        }

        true
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::is_palindrome(121), true);
        assert_eq!(Solution::is_palindrome(-121), false);
        assert_eq!(Solution::is_palindrome(10), false);
        assert_eq!(Solution::is_palindrome(0), true);
        assert_eq!(Solution::is_palindrome(12321), true);
    }
}
