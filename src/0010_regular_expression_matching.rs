use std::collections::HashMap;

fn regex_dfs(
    i: usize,
    j: usize,
    s: &[u8],
    p: &[u8],
    cache: &mut HashMap<(usize, usize), bool>,
) -> bool {
    if let Some(&cached) = cache.get(&(i, j)) {
        return cached;
    }
    if i >= s.len() && j >= p.len() {
        return true;
    }
    if j >= p.len() {
        return false;
    }

    let is_match = i < s.len() && (s[i] == p[j] || p[j] == b'.');
    let ans = if j + 1 < p.len() && p[j + 1] == b'*' {
        regex_dfs(i, j + 2, s, p, cache) || (is_match && regex_dfs(i + 1, j, s, p, cache))
    } else if is_match {
        regex_dfs(i + 1, j + 1, s, p, cache)
    } else {
        false
    };

    cache.insert((i, j), ans);
    ans
}

pub fn is_match(s: String, p: String) -> bool {
    let mut cache = HashMap::new();
    regex_dfs(0, 0, s.as_bytes(), p.as_bytes(), &mut cache)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(is_match("aa".to_string(), "a".to_string()), false);
        assert_eq!(is_match("aa".to_string(), "a*".to_string()), true);
        assert_eq!(is_match("ab".to_string(), ".*".to_string()), true);
    }
}
