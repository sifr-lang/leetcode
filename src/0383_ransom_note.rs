use std::collections::HashMap;

struct Solution;

impl Solution {
    pub fn can_construct(ransom_note: String, magazine: String) -> bool {
        let mut ransom_counter = HashMap::new();
        let mut magazine_counter = HashMap::new();

        for ch in ransom_note.chars() {
            *ransom_counter.entry(ch).or_insert(0) += 1;
        }
        for ch in magazine.chars() {
            *magazine_counter.entry(ch).or_insert(0) += 1;
        }

        for ch in ransom_note.chars() {
            if magazine_counter.get(&ch).unwrap_or(&0) < ransom_counter.get(&ch).unwrap_or(&0) {
                return false;
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
            Solution::can_construct(String::from("a"), String::from("b")),
            false
        );
        assert_eq!(
            Solution::can_construct(String::from("aa"), String::from("aab")),
            true
        );
    }
}
