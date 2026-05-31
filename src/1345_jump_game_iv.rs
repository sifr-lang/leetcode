use std::collections::{HashMap, VecDeque};

struct Solution;

impl Solution {
    pub fn min_jumps(arr: Vec<i32>) -> i32 {
        let n = arr.len();
        if n < 2 {
            return 0;
        }

        let mut d = HashMap::<i32, Vec<usize>>::new();
        for i in (0..n).rev() {
            d.entry(arr[i]).or_default().push(i);
        }

        let mut seen = vec![false; n];
        seen[0] = true;
        let mut steps = 0;
        let mut level = VecDeque::from(vec![0usize]);

        while !level.is_empty() {
            steps += 1;
            for _ in 0..level.len() {
                let current = level.pop_front().unwrap();
                for nei in Self::get_unqueued_neighbors(current, &arr, &mut seen, &mut d) {
                    if nei == n - 1 {
                        return steps;
                    }
                    level.push_back(nei);
                }
            }
        }

        steps
    }

    fn get_unqueued_neighbors(
        i: usize,
        arr: &[i32],
        seen: &mut [bool],
        d: &mut HashMap<i32, Vec<usize>>,
    ) -> Vec<usize> {
        let n = arr.len();
        let mut adj = Vec::new();

        if i > 0 && !seen[i - 1] {
            seen[i - 1] = true;
            adj.push(i - 1);
        }

        if i < n - 1 && !seen[i + 1] {
            seen[i + 1] = true;
            adj.push(i + 1);
        }

        if let Some(nodes) = d.remove(&arr[i]) {
            for node in nodes {
                if node != i {
                    adj.push(node);
                    seen[node] = true;
                }
            }
        }

        adj
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::min_jumps(vec![100, -23, -23, 404, 100, 23, 23, 23, 3, 404]),
            3
        );
        assert_eq!(Solution::min_jumps(vec![7]), 0);
        assert_eq!(Solution::min_jumps(vec![7, 6, 9, 6, 9, 6, 9, 7]), 1);
    }
}
