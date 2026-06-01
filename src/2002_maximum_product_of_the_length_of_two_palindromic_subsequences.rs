struct Solution;

impl Solution {
    pub fn max_product(s: String) -> i32 {
        let s = s.into_bytes();
        let n = s.len();
        let limit = 1_usize << n;
        let mut first = vec![0_usize; limit];
        let mut last = vec![0_usize; limit];

        for i in 0..n {
            let start = 1_usize << i;
            let stop = 1_usize << (i + 1);
            for mask in start..stop {
                first[mask] = i;
            }
        }

        for i in 0..n {
            let step = 1_usize << (i + 1);
            let mut mask = 1_usize << i;
            while mask < limit {
                last[mask] = i;
                mask += step;
            }
        }

        let mut memo = vec![-1_i32; limit];
        let mut ans = 0;
        for mask in 1..limit {
            let product = Self::dp(mask, &s, &first, &last, &mut memo)
                * Self::dp(limit - 1 - mask, &s, &first, &last, &mut memo);
            ans = ans.max(product);
        }

        ans
    }

    fn dp(mask: usize, s: &[u8], first: &[usize], last: &[usize], memo: &mut [i32]) -> i32 {
        if mask == 0 {
            return 0;
        }
        if memo[mask] >= 0 {
            return memo[mask];
        }

        let value = if (mask & (mask - 1)) == 0 {
            1
        } else {
            let left = last[mask];
            let right = first[mask];
            let left_bit = 1_usize << left;
            let right_bit = 1_usize << right;
            let mut best = Self::dp(mask - left_bit, s, first, last, memo)
                .max(Self::dp(mask - right_bit, s, first, last, memo));
            let mut without_both = Self::dp(mask - left_bit - right_bit, s, first, last, memo);
            if s[left] == s[right] {
                without_both += 2;
            }
            best = best.max(without_both);
            best
        };

        memo[mask] = value;
        value
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::max_product(String::from("leetcodecom")), 9);
        assert_eq!(Solution::max_product(String::from("bb")), 1);
        assert_eq!(Solution::max_product(String::from("accbcaxxcxx")), 25);
    }
}
