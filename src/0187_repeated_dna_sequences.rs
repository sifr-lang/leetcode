struct Solution;

use std::collections::BTreeSet;

impl Solution {
    pub fn find_repeated_dna_sequences(s: String) -> Vec<String> {
        let mut result = BTreeSet::new();
        let mut previous_sequences = BTreeSet::new();

        if s.len() < 10 {
            return Vec::new();
        }

        for i in 0..=s.len() - 10 {
            let current = s[i..i + 10].to_string();
            if previous_sequences.contains(&current) {
                result.insert(current.clone());
            }
            previous_sequences.insert(current);
        }

        result.into_iter().collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sorted_vec<T: Ord>(mut values: Vec<T>) -> Vec<T> {
        values.sort();
        values
    }

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            sorted_vec(Solution::find_repeated_dna_sequences(String::from(
                "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"
            ))),
            vec![String::from("AAAAACCCCC"), String::from("CCCCCAAAAA")]
        );
        assert_eq!(
            sorted_vec(Solution::find_repeated_dna_sequences(String::from(
                "AAAAAAAAAAAAA"
            ))),
            vec![String::from("AAAAAAAAAA")]
        );
    }
}
