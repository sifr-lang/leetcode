struct Solution;

use std::collections::HashMap;

impl Solution {
    pub fn alien_order(words: Vec<String>) -> String {
        let mut adj: HashMap<char, Vec<char>> = HashMap::new();
        let mut chars = Vec::new();

        for word in &words {
            for ch in word.chars() {
                if !adj.contains_key(&ch) {
                    adj.insert(ch, Vec::new());
                    chars.push(ch);
                }
            }
        }

        for pair in words.windows(2) {
            let first: Vec<char> = pair[0].chars().collect();
            let second: Vec<char> = pair[1].chars().collect();
            let min_len = first.len().min(second.len());
            if first.len() > second.len() && first[..min_len] == second[..min_len] {
                return String::new();
            }

            for index in 0..min_len {
                if first[index] != second[index] {
                    let neighbors = adj.entry(first[index]).or_default();
                    if !neighbors.contains(&second[index]) {
                        neighbors.push(second[index]);
                    }
                    break;
                }
            }
        }

        let mut visited: HashMap<char, bool> = HashMap::new();
        let mut res = Vec::new();
        for ch in chars {
            if dfs(ch, &adj, &mut visited, &mut res) {
                return String::new();
            }
        }

        res.reverse();
        res.into_iter().collect()
    }
}

fn dfs(
    ch: char,
    adj: &HashMap<char, Vec<char>>,
    visited: &mut HashMap<char, bool>,
    res: &mut Vec<char>,
) -> bool {
    if let Some(in_path) = visited.get(&ch) {
        return *in_path;
    }

    visited.insert(ch, true);
    if let Some(neighbors) = adj.get(&ch) {
        for next in neighbors {
            if dfs(*next, adj, visited, res) {
                return true;
            }
        }
    }

    visited.insert(ch, false);
    res.push(ch);
    false
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::alien_order(vec![
                "wrt".to_string(),
                "wrf".to_string(),
                "er".to_string(),
                "ett".to_string(),
                "rftt".to_string()
            ]),
            "wertf"
        );
        assert_eq!(
            Solution::alien_order(vec!["z".to_string(), "x".to_string()]),
            "zx"
        );
        assert_eq!(
            Solution::alien_order(vec!["z".to_string(), "x".to_string(), "z".to_string()]),
            ""
        );
    }
}
