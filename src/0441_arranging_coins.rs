struct Solution;

impl Solution {
    pub fn arrange_coins(n: i64) -> i64 {
        let (mut l, mut r) = (1, n);
        let mut res = 0;

        while l <= r {
            let mid = l + (r - l) / 2;
            let coins = (mid * (mid + 1)) / 2;

            if coins > n {
                r = mid - 1;
            } else {
                l = mid + 1;
                res = mid;
            }
        }

        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::arrange_coins(5), 2);
        assert_eq!(Solution::arrange_coins(8), 3);
    }
}
