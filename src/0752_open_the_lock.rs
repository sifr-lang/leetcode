struct Solution;

use std::collections::{HashSet, VecDeque};

impl Solution {
    fn lock_children(wheel: &str) -> Vec<String> {
        let mut res = Vec::new();
        for i in 0..4 {
            let digit = ((wheel.as_bytes()[i] - b'0' + 1) % 10 + b'0') as char;
            res.push(format!("{}{}{}", &wheel[..i], digit, &wheel[i + 1..]));
            let digit = ((wheel.as_bytes()[i] - b'0' + 9) % 10 + b'0') as char;
            res.push(format!("{}{}{}", &wheel[..i], digit, &wheel[i + 1..]));
        }
        res
    }

    pub fn open_lock(deadends: Vec<String>, target: String) -> i32 {
        if deadends.iter().any(|deadend| deadend == "0000") {
            return -1;
        }

        let mut visit: HashSet<String> = deadends.into_iter().collect();
        let mut q = VecDeque::new();
        q.push_back(("0000".to_string(), 0));

        while let Some((wheel, turns)) = q.pop_front() {
            if wheel == target {
                return turns;
            }
            for child in Self::lock_children(&wheel) {
                if !visit.contains(&child) {
                    visit.insert(child.clone());
                    q.push_back((child, turns + 1));
                }
            }
        }
        -1
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::open_lock(
                vec![
                    "0201".to_string(),
                    "0101".to_string(),
                    "0102".to_string(),
                    "1212".to_string(),
                    "2002".to_string()
                ],
                "0202".to_string()
            ),
            6
        );
        assert_eq!(
            Solution::open_lock(vec!["8888".to_string()], "0009".to_string()),
            1
        );
        assert_eq!(
            Solution::open_lock(
                vec![
                    "8887".to_string(),
                    "8889".to_string(),
                    "8878".to_string(),
                    "8898".to_string(),
                    "8788".to_string(),
                    "8988".to_string(),
                    "7888".to_string(),
                    "9888".to_string()
                ],
                "8888".to_string()
            ),
            -1
        );
    }
}
