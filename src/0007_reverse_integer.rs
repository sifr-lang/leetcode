struct Solution;

use std::i32::{MAX, MIN};

impl Solution {
    pub fn reverse(x: i32) -> i32 {
        let mut res = 0;
        let mut x = x;
        while x != 0 {
            let digit = x % 10;
            x /= 10;

            if res > MAX / 10 || (res == MAX / 10 && digit > MAX % 10) {
                return 0;
            }
            if res < MIN / 10 || (res == MIN / 10 && digit < MIN % 10) {
                return 0;
            }

            res = (res * 10) + digit;
        }
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::reverse(123), 321);
        assert_eq!(Solution::reverse(-123), -321);
        assert_eq!(Solution::reverse(120), 21);
        assert_eq!(Solution::reverse(0), 0);
    }
}
