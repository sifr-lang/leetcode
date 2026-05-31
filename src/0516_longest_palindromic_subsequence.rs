use std::collections::HashMap;

fn lcs(i: usize, j: usize, s: &[u8], t: &[u8], memo: &mut HashMap<(usize, usize), i32>) -> i32 {
    if i == s.len() || j == t.len() {
        return 0;
    }

    if let Some(&cached) = memo.get(&(i, j)) {
        return cached;
    }

    let ans = if s[i] == t[j] {
        1 + lcs(i + 1, j + 1, s, t, memo)
    } else {
        lcs(i + 1, j, s, t, memo).max(lcs(i, j + 1, s, t, memo))
    };

    memo.insert((i, j), ans);
    ans
}

pub fn longest_palindrome_subseq(s: String) -> i32 {
    let t: Vec<u8> = s.bytes().rev().collect();
    let mut memo = HashMap::new();
    lcs(0, 0, s.as_bytes(), &t, &mut memo)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(longest_palindrome_subseq("bbbab".to_string()), 4);
        assert_eq!(longest_palindrome_subseq("cbbd".to_string()), 2);
    }
}
