struct Solution;

use std::collections::HashSet;

impl Solution {
    fn valid_tree_dfs(i: i32, prev: i32, adj: &[Vec<i32>], visit: &mut HashSet<i32>) -> bool {
        if visit.contains(&i) {
            return false;
        }

        visit.insert(i);
        for &j in &adj[i as usize] {
            if j == prev {
                continue;
            }
            if !Self::valid_tree_dfs(j, i, adj, visit) {
                return false;
            }
        }
        true
    }

    pub fn valid_tree(n: i32, edges: Vec<Vec<i32>>) -> bool {
        if n == 0 {
            return true;
        }

        let mut adj = vec![Vec::new(); n as usize];
        for edge in edges {
            let n1 = edge[0];
            let n2 = edge[1];
            adj[n1 as usize].push(n2);
            adj[n2 as usize].push(n1);
        }

        let mut visit = HashSet::new();
        Self::valid_tree_dfs(0, -1, &adj, &mut visit) && n as usize == visit.len()
    }

    pub fn valid_tree_dsu(n: i32, edges: Vec<Vec<i32>>) -> bool {
        let mut parents: Vec<usize> = (0..n as usize).collect();
        let mut ranks = vec![1; n as usize];
        let mut components = n;

        fn find(value: usize, parents: &mut [usize]) -> usize {
            if parents[value] != value {
                parents[value] = find(parents[value], parents);
            }
            parents[value]
        }

        for edge in edges {
            let root_a = find(edge[0] as usize, &mut parents);
            let root_b = find(edge[1] as usize, &mut parents);
            if root_a == root_b {
                return false;
            }
            if ranks[root_a] > ranks[root_b] {
                parents[root_b] = root_a;
                ranks[root_a] += ranks[root_b];
            } else {
                parents[root_a] = root_b;
                ranks[root_b] += ranks[root_a];
            }
            components -= 1;
        }

        components == 1
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::valid_tree_dsu(5, vec![vec![0, 1], vec![0, 2], vec![0, 3], vec![1, 4]]),
            true
        );
        assert_eq!(
            Solution::valid_tree_dsu(
                5,
                vec![vec![0, 1], vec![1, 2], vec![2, 3], vec![1, 3], vec![1, 4]]
            ),
            false
        );
        assert_eq!(
            Solution::valid_tree(5, vec![vec![0, 1], vec![0, 2], vec![0, 3], vec![1, 4]]),
            true
        );
        assert_eq!(
            Solution::valid_tree(
                5,
                vec![vec![0, 1], vec![1, 2], vec![2, 3], vec![1, 3], vec![1, 4]]
            ),
            false
        );
    }
}
