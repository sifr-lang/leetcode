struct Solution;

impl Solution {
    pub fn hammingWeight(mut n: u32) -> i32 {
        let mut count = 0;

        while n > 0 {
            n = n & (n - 1);
            count += 1;
        }

        count
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::hammingWeight(11), 3);
        assert_eq!(Solution::hammingWeight(128), 1);
        assert_eq!(Solution::hammingWeight(2147483645), 30);
    }
}
