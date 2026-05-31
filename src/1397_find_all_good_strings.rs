use std::collections::HashMap;

struct Solution;

impl Solution {
    pub fn find_good_strings(_n: i32, s1: String, s2: String, evil: String) -> i32 {
        let good_s2 = Self::good(&s2, &evil);
        let good_s1 = Self::good(&s1, &evil);
        let contains_bonus = if s1.contains(&evil) { 0 } else { 1 };
        (good_s2 - good_s1 + contains_bonus).rem_euclid(1_000_000_007)
    }

    fn good(s: &str, evil: &str) -> i32 {
        let a = b'a';
        let z = b'z';
        let arr_e = evil.as_bytes();
        let len_e = arr_e.len();
        let next = Self::prefix_table(evil);
        let arr = s.as_bytes();
        let len_a = arr.len();
        let mut memo = HashMap::<(usize, bool, bool, usize), i32>::new();
        Self::count_good(
            0, true, true, 0, arr, len_a, arr_e, len_e, &next, a, z, &mut memo,
        )
    }

    fn prefix_table(evil: &str) -> Vec<usize> {
        let bytes = evil.as_bytes();
        let mut next = vec![0; bytes.len()];
        for i in 1..bytes.len() {
            let mut j = next[i - 1];
            while j > 0 && bytes[i] != bytes[j] {
                j = next[j - 1];
            }
            if bytes[i] == bytes[j] {
                next[i] = j + 1;
            }
        }
        next
    }

    #[allow(clippy::too_many_arguments)]
    fn count_good(
        i: usize,
        skip: bool,
        reach: bool,
        e: usize,
        arr: &[u8],
        len_a: usize,
        arr_e: &[u8],
        len_e: usize,
        next: &[usize],
        a: u8,
        z: u8,
        memo: &mut HashMap<(usize, bool, bool, usize), i32>,
    ) -> i32 {
        if e == len_e {
            return 0;
        }
        if i == len_a {
            return if skip { 0 } else { 1 };
        }
        if let Some(value) = memo.get(&(i, skip, reach, e)) {
            return *value;
        }

        let limit = if reach { arr[i] } else { z };
        let mut ans = 0i64;

        if skip {
            ans += i64::from(Self::count_good(
                i + 1,
                true,
                false,
                0,
                arr,
                len_a,
                arr_e,
                len_e,
                next,
                a,
                z,
                memo,
            ));
        }

        for c in a..=limit {
            let mut ee = e;
            while ee > 0 && arr_e[ee] != c {
                ee = next[ee - 1];
            }
            if arr_e[ee] == c {
                ee += 1;
            }
            ans += i64::from(Self::count_good(
                i + 1,
                false,
                reach && c == limit,
                ee,
                arr,
                len_a,
                arr_e,
                len_e,
                next,
                a,
                z,
                memo,
            ));
        }

        let value = (ans % 1_000_000_007) as i32;
        memo.insert((i, skip, reach, e), value);
        value
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::find_good_strings(2, "aa".to_string(), "da".to_string(), "b".to_string()),
            51
        );
        assert_eq!(
            Solution::find_good_strings(
                8,
                "leetcode".to_string(),
                "leetgoes".to_string(),
                "leet".to_string()
            ),
            0
        );
        assert_eq!(
            Solution::find_good_strings(2, "gx".to_string(), "gz".to_string(), "x".to_string()),
            2
        );
    }
}
