use std::collections::HashMap;

pub fn num_distinct(s: String, t: String) -> i64 {
    let s = s.as_bytes();
    let t = t.as_bytes();
    let mut cache: HashMap<(usize, usize), i64> = HashMap::new();

    for i in 0..=s.len() {
        cache.insert((i, t.len()), 1);
    }
    for j in 0..t.len() {
        cache.insert((s.len(), j), 0);
    }

    for i in (0..s.len()).rev() {
        for j in (0..t.len()).rev() {
            let ans = if s[i] == t[j] {
                cache[&(i + 1, j + 1)] + cache[&(i + 1, j)]
            } else {
                cache[&(i + 1, j)]
            };
            cache.insert((i, j), ans);
        }
    }

    cache[&(0, 0)]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(num_distinct("rabbbit".to_string(), "rabbit".to_string()), 3);
        assert_eq!(num_distinct("babgbag".to_string(), "bag".to_string()), 5);
    }
}
