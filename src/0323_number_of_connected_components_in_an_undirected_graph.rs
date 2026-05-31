use std::collections::{HashMap, HashSet};

struct UnionFind {
    parent: HashMap<i32, i32>,
}

impl UnionFind {
    fn new() -> Self {
        Self {
            parent: HashMap::new(),
        }
    }

    fn find_parent(&mut self, value: i32) -> i32 {
        self.parent.entry(value).or_insert(value);

        let mut parent = self.parent[&value];
        while parent != self.parent[&parent] {
            let grandparent = self.parent[&self.parent[&parent]];
            self.parent.insert(parent, grandparent);
            parent = self.parent[&parent];
        }
        parent
    }

    fn union(&mut self, left: i32, right: i32) {
        let left_parent = self.find_parent(left);
        let right_parent = self.find_parent(right);
        if left_parent != right_parent {
            self.parent.insert(right_parent, left_parent);
        }
    }
}

struct Solution;

impl Solution {
    pub fn count_components(n: i32, edges: Vec<Vec<i32>>) -> i32 {
        let mut dsu = UnionFind::new();

        for edge in edges {
            dsu.union(edge[0], edge[1]);
        }

        let mut components = HashSet::new();
        for value in 0..n {
            components.insert(dsu.find_parent(value));
        }
        components.len() as i32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::count_components(5, vec![vec![0, 1], vec![1, 2], vec![3, 4]]),
            2
        );
        assert_eq!(
            Solution::count_components(5, vec![vec![0, 1], vec![1, 2], vec![2, 3], vec![3, 4]]),
            1
        );
    }
}
