struct Solution;

impl Solution {
    pub fn is_happy(mut n: i32) -> bool {
        loop {
            let mut s = 0;
            while n > 0 {
                s += (n % 10).pow(2);
                n /= 10;
            }
            match s {
                1 | 4 => break s == 1,
                _ => n = s,
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::is_happy(19), true);
        assert_eq!(Solution::is_happy(2), false);
    }
}
