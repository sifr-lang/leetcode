struct Solution;

use std::collections::VecDeque;

impl Solution {
    pub fn is_bipartite_bfs(graph: Vec<Vec<i32>>) -> bool {
        let mut colors = vec![-1; graph.len()];

        for i in 0..graph.len() {
            if colors[i] == -1 {
                let mut q = VecDeque::new();
                q.push_back(i);
                colors[i] = 0;

                while let Some(node) = q.pop_front() {
                    for &nbh in &graph[node] {
                        let nbh = nbh as usize;
                        if colors[nbh] == -1 {
                            colors[nbh] = 1 - colors[node];
                            q.push_back(nbh);
                        } else if colors[nbh] == colors[node] {
                            return false;
                        }
                    }
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
            Solution::is_bipartite_bfs(vec![vec![1, 2, 3], vec![0, 2], vec![0, 1, 3], vec![0, 2]]),
            false
        );
        assert_eq!(
            Solution::is_bipartite_bfs(vec![vec![1, 3], vec![0, 2], vec![1, 3], vec![0, 2]]),
            true
        );
    }
}
