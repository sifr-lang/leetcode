struct Solution;

use std::cmp::Ordering;
use std::collections::BinaryHeap;

#[derive(Clone, Copy)]
struct ProbState {
    prob: f64,
    node: usize,
}

impl Eq for ProbState {}
impl PartialEq for ProbState {
    fn eq(&self, other: &Self) -> bool {
        self.prob == other.prob && self.node == other.node
    }
}
impl Ord for ProbState {
    fn cmp(&self, other: &Self) -> Ordering {
        self.prob
            .partial_cmp(&other.prob)
            .unwrap_or(Ordering::Equal)
    }
}
impl PartialOrd for ProbState {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl Solution {
    pub fn max_probability(
        n: i32,
        edges: Vec<Vec<i32>>,
        succ_prob: Vec<f64>,
        start_node: i32,
        end_node: i32,
    ) -> f64 {
        let mut graph = vec![Vec::<(usize, f64)>::new(); n as usize];
        for (index, edge) in edges.iter().enumerate() {
            graph[edge[0] as usize].push((edge[1] as usize, succ_prob[index]));
            graph[edge[1] as usize].push((edge[0] as usize, succ_prob[index]));
        }
        let mut best = vec![0.0; n as usize];
        let mut heap = BinaryHeap::new();
        best[start_node as usize] = 1.0;
        heap.push(ProbState {
            prob: 1.0,
            node: start_node as usize,
        });
        while let Some(state) = heap.pop() {
            if state.node == end_node as usize {
                return state.prob;
            }
            if state.prob < best[state.node] {
                continue;
            }
            for (next, prob) in &graph[state.node] {
                let candidate = state.prob * prob;
                if candidate > best[*next] {
                    best[*next] = candidate;
                    heap.push(ProbState {
                        prob: candidate,
                        node: *next,
                    });
                }
            }
        }
        0.0
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::max_probability(
                3,
                vec![vec![0, 1], vec![1, 2], vec![0, 2]],
                vec![0.5, 0.5, 0.2],
                0,
                2
            ),
            0.25
        );
        assert_eq!(
            Solution::max_probability(
                3,
                vec![vec![0, 1], vec![1, 2], vec![0, 2]],
                vec![0.5, 0.5, 0.3],
                0,
                2
            ),
            0.3
        );
        assert_eq!(
            Solution::max_probability(3, vec![vec![0, 1]], vec![0.5], 0, 2),
            0.0
        );
    }
}
