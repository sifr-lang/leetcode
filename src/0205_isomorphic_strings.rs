struct Solution;

use std::collections::HashMap;

impl Solution {
    pub fn is_isomorphic(s: String, t: String) -> bool {
        let (mut map_s_to_t, mut map_t_to_s) = (HashMap::new(), HashMap::new());

        for (c1, c2) in s.chars().zip(t.chars()) {
            if let Some(w) = map_s_to_t.insert(c1, c2) {
                if w != c2 {
                    return false;
                }
            }

            if let Some(w) = map_t_to_s.insert(c2, c1) {
                if w != c1 {
                    return false;
                }
            }
        }

        true
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::is_isomorphic(String::from("egg"), String::from("add")),
            true
        );
        assert_eq!(
            Solution::is_isomorphic(String::from("foo"), String::from("bar")),
            false
        );
    }
}
