struct Solution;

use std::collections::HashMap;

impl Solution {
    fn safe_dfs(i: usize, graph: &[Vec<i32>], safe: &mut HashMap<usize, bool>) -> bool {
        if let Some(value) = safe.get(&i) {
            return *value;
        }
        safe.insert(i, false);
        for &nei in &graph[i] {
            if !Self::safe_dfs(nei as usize, graph, safe) {
                return safe[&i];
            }
        }
        safe.insert(i, true);
        safe[&i]
    }

    pub fn eventual_safe_nodes(graph: Vec<Vec<i32>>) -> Vec<i32> {
        let mut safe = HashMap::new();
        let mut res = Vec::new();
        for i in 0..graph.len() {
            if Self::safe_dfs(i, &graph, &mut safe) {
                res.push(i as i32);
            }
        }
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::eventual_safe_nodes(vec![
                vec![1, 2],
                vec![2, 3],
                vec![5],
                vec![0],
                vec![5],
                vec![],
                vec![]
            ]),
            vec![2, 4, 5, 6]
        );
        assert_eq!(
            Solution::eventual_safe_nodes(vec![
                vec![1, 2, 3, 4],
                vec![1, 2],
                vec![3, 4],
                vec![0, 4],
                vec![]
            ]),
            vec![4]
        );
    }
}
