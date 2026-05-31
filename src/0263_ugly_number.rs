struct Solution;

impl Solution {
    pub fn is_ugly(n: i32) -> bool {
        if n < 1 {
            return false;
        }
        let mut n = n;
        let ugly_primes = vec![2, 3, 5];

        for prime in ugly_primes {
            while n % prime == 0 {
                n /= prime;
            }
        }

        n == 1
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::is_ugly(6), true);
        assert_eq!(Solution::is_ugly(1), true);
        assert_eq!(Solution::is_ugly(14), false);
    }
}
