const MOD: i64 = 1_000_000_007;

pub fn count_vowel_permutation(n: i32) -> i64 {
    if n <= 0 {
        return 0;
    }

    let (mut a, mut e, mut i, mut o, mut u) = (1_i64, 1_i64, 1_i64, 1_i64, 1_i64);
    for _ in 1..n {
        let next_a = (e + i + u) % MOD;
        let next_e = (a + i) % MOD;
        let next_i = (e + o) % MOD;
        let next_o = i % MOD;
        let next_u = (i + o) % MOD;
        a = next_a;
        e = next_e;
        i = next_i;
        o = next_o;
        u = next_u;
    }

    (a + e + i + o + u) % MOD
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
