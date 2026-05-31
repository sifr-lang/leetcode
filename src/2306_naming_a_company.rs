struct Solution;

use std::collections::{HashMap, HashSet};

impl Solution {
    pub fn distinct_names(ideas: Vec<String>) -> i32 {
        let mut suffixes: HashMap<char, HashSet<String>> = HashMap::new();

        for idea in ideas {
            let mut chars = idea.chars();
            let first = chars.next().unwrap();
            suffixes.entry(first).or_default().insert(chars.collect());
        }

        if suffixes.len() < 2 {
            return 0;
        }

        let mut num_distinct_names = 0;
        let keys: Vec<char> = suffixes.keys().copied().collect();
        for &prefix_1 in &keys {
            for &prefix_2 in &keys {
                if prefix_2 > prefix_1 {
                    let mut num_suffixes_1 = suffixes[&prefix_1].len() as i32;
                    let mut num_suffixes_2 = suffixes[&prefix_2].len() as i32;
                    for suffix in &suffixes[&prefix_1] {
                        if suffixes[&prefix_2].contains(suffix) {
                            num_suffixes_1 -= 1;
                            num_suffixes_2 -= 1;
                        }
                    }
                    num_distinct_names += 2 * num_suffixes_1 * num_suffixes_2;
                }
            }
        }

        num_distinct_names
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::distinct_names(vec![
                String::from("coffee"),
                String::from("donuts"),
                String::from("time"),
                String::from("toffee")
            ]),
            6
        );
        assert_eq!(
            Solution::distinct_names(vec![String::from("lack"), String::from("back")]),
            0
        );
    }
}
