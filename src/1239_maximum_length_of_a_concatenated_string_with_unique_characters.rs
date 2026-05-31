struct Solution;

use std::collections::{HashMap, HashSet};

impl Solution {
    fn overlap(char_set: &HashSet<char>, s: &str) -> bool {
        let mut counts: HashMap<char, i32> = HashMap::new();
        for &ch in char_set {
            *counts.entry(ch).or_insert(0) += 1;
        }
        for ch in s.chars() {
            *counts.entry(ch).or_insert(0) += 1;
        }
        counts.values().copied().max().unwrap_or(0) > 1
    }

    fn max_length_backtrack(i: usize, arr: &[String], char_set: &mut HashSet<char>) -> i32 {
        if i == arr.len() {
            return char_set.len() as i32;
        }

        let mut res = 0;
        if !Self::overlap(char_set, &arr[i]) {
            for c in arr[i].chars() {
                char_set.insert(c);
            }
            res = Self::max_length_backtrack(i + 1, arr, char_set);
            for c in arr[i].chars() {
                char_set.remove(&c);
            }
        }

        res.max(Self::max_length_backtrack(i + 1, arr, char_set))
    }

    pub fn max_length(arr: Vec<String>) -> i32 {
        let mut char_set = HashSet::new();
        Self::max_length_backtrack(0, &arr, &mut char_set)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::max_length(vec![
                String::from("un"),
                String::from("iq"),
                String::from("ue")
            ]),
            4
        );
        assert_eq!(
            Solution::max_length(vec![
                String::from("cha"),
                String::from("r"),
                String::from("act"),
                String::from("ers")
            ]),
            6
        );
        assert_eq!(
            Solution::max_length(vec![String::from("abcdefghijklmnopqrstuvwxyz")]),
            26
        );
    }
}
