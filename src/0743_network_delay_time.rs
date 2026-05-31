struct Solution;

use std::cmp::Reverse;
use std::collections::BinaryHeap;

impl Solution {
    pub fn network_delay_time(times: Vec<Vec<i32>>, n: i32, k: i32) -> i32 {
        let mut graph = vec![Vec::<(i32, i32)>::new(); n as usize + 1];
        for edge in times {
            graph[edge[0] as usize].push((edge[1], edge[2]));
        }
        let mut dist = vec![i32::MAX; n as usize + 1];
        let mut heap = BinaryHeap::new();
        dist[k as usize] = 0;
        heap.push(Reverse((0, k)));
        while let Some(Reverse((time, node))) = heap.pop() {
            if time > dist[node as usize] {
                continue;
            }
            for (next, weight) in &graph[node as usize] {
                let candidate = time + weight;
                if candidate < dist[*next as usize] {
                    dist[*next as usize] = candidate;
                    heap.push(Reverse((candidate, *next)));
                }
            }
        }
        let answer = dist[1..].iter().copied().max().unwrap();
        if answer == i32::MAX {
            -1
        } else {
            answer
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::network_delay_time(vec![vec![2, 1, 1], vec![2, 3, 1], vec![3, 4, 1]], 4, 2),
            2
        );
        assert_eq!(Solution::network_delay_time(vec![vec![1, 2, 1]], 2, 1), 1);
        assert_eq!(Solution::network_delay_time(vec![vec![1, 2, 1]], 2, 2), -1);
    }
}
