struct Solution;

use std::collections::HashMap;

impl Solution {
    pub fn group_anagrams(strs: Vec<String>) -> Vec<Vec<String>> {
        let mut map: HashMap<[u8; 26], Vec<String>> = HashMap::new();

        for s in strs {
            let mut key = [0_u8; 26];

            for c in s.chars() {
                key[c as usize - 'a' as usize] += 1;
            }

            if let Some(vals) = map.get_mut(&key) {
                vals.push(s);
            } else {
                map.insert(key, vec![s]);
            }
        }

        map.into_values().collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn normalize_groups(mut groups: Vec<Vec<String>>) -> Vec<Vec<String>> {
        for group in &mut groups {
            group.sort();
        }
        groups.sort();
        groups
    }

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            normalize_groups(Solution::group_anagrams(vec![
                String::from("eat"),
                String::from("tea"),
                String::from("tan"),
                String::from("ate"),
                String::from("nat"),
                String::from("bat")
            ])),
            normalize_groups(vec![
                vec![
                    String::from("eat"),
                    String::from("tea"),
                    String::from("ate")
                ],
                vec![String::from("tan"), String::from("nat")],
                vec![String::from("bat")]
            ])
        );
        assert_eq!(
            normalize_groups(Solution::group_anagrams(vec![String::from("")])),
            normalize_groups(vec![vec![String::from("")]])
        );
        assert_eq!(
            normalize_groups(Solution::group_anagrams(vec![String::from("a")])),
            normalize_groups(vec![vec![String::from("a")]])
        );
    }
}
