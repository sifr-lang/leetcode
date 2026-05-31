use std::collections::HashMap;

const MOD: i64 = 1_000_000_007;

fn vowel_count(n: i32, c: u8, memo: &mut HashMap<(u8, i32), i64>) -> i64 {
    if let Some(&cached) = memo.get(&(c, n)) {
        return cached;
    }
    if n == 1 {
        return match c {
            b'a' => 1,
            b'e' => 2,
            b'i' => 4,
            b'o' => 2,
            b'u' => 1,
            0 => 5,
            _ => 0,
        };
    }

    let ans = match c {
        b'a' => vowel_count(n - 1, b'e', memo),
        b'e' => vowel_count(n - 1, b'a', memo) + vowel_count(n - 1, b'i', memo),
        b'i' => {
            vowel_count(n - 1, b'a', memo)
                + vowel_count(n - 1, b'e', memo)
                + vowel_count(n - 1, b'o', memo)
                + vowel_count(n - 1, b'u', memo)
        }
        b'o' => vowel_count(n - 1, b'i', memo) + vowel_count(n - 1, b'u', memo),
        b'u' => vowel_count(n - 1, b'a', memo),
        0 => {
            let mut total = 0;
            for ch in [b'a', b'e', b'i', b'o', b'u'] {
                total += vowel_count(n - 1, ch, memo);
            }
            total
        }
        _ => 0,
    } % MOD;
    memo.insert((c, n), ans);
    ans
}

pub fn count_vowel_permutation(n: i32) -> i64 {
    let mut memo = HashMap::new();
    vowel_count(n, 0, &mut memo) % MOD
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(count_vowel_permutation(1), 5);
        assert_eq!(count_vowel_permutation(2), 10);
        assert_eq!(count_vowel_permutation(5), 68);
    }
}
