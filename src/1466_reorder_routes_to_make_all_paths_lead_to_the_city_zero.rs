use std::collections::{HashMap, HashSet};

struct Solution;

impl Solution {
    pub fn min_reorder(_n: i32, connections: Vec<Vec<i32>>) -> i32 {
        let mut edges = HashSet::<(i32, i32)>::new();
        let mut neighbors = HashMap::<i32, Vec<i32>>::new();
        let mut visit = HashSet::<i32>::new();

        for edge in &connections {
            edges.insert((edge[0], edge[1]));
            neighbors.entry(edge[0]).or_default().push(edge[1]);
            neighbors.entry(edge[1]).or_default().push(edge[0]);
        }

        visit.insert(0);
        let mut changes = 0;
        Self::dfs(0, &neighbors, &edges, &mut visit, &mut changes);
        changes
    }

    fn dfs(
        city: i32,
        neighbors: &HashMap<i32, Vec<i32>>,
        edges: &HashSet<(i32, i32)>,
        visit: &mut HashSet<i32>,
        changes: &mut i32,
    ) {
        if let Some(city_neighbors) = neighbors.get(&city) {
            for &neighbor in city_neighbors {
                if visit.contains(&neighbor) {
                    continue;
                }
                if !edges.contains(&(neighbor, city)) {
                    *changes += 1;
                }
                visit.insert(neighbor);
                Self::dfs(neighbor, neighbors, edges, visit, changes);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::min_reorder(
                6,
                vec![vec![0, 1], vec![1, 3], vec![2, 3], vec![4, 0], vec![4, 5]]
            ),
            3
        );
        assert_eq!(
            Solution::min_reorder(5, vec![vec![1, 0], vec![1, 2], vec![3, 2], vec![3, 4]]),
            2
        );
        assert_eq!(Solution::min_reorder(3, vec![vec![1, 0], vec![2, 0]]), 0);
    }
}
