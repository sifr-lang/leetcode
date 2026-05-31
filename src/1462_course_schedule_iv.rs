use std::collections::{HashMap, HashSet};

struct Solution;

impl Solution {
    pub fn check_if_prerequisite(
        num_courses: i32,
        prerequisites: Vec<Vec<i32>>,
        queries: Vec<Vec<i32>>,
    ) -> Vec<bool> {
        let mut adj = HashMap::<i32, Vec<i32>>::new();
        for edge in prerequisites {
            adj.entry(edge[1]).or_default().push(edge[0]);
        }

        let mut prereq_map = HashMap::<i32, HashSet<i32>>::new();
        for crs in 0..num_courses {
            Self::dfs(crs, &adj, &mut prereq_map);
        }

        let mut res = Vec::new();
        for query in queries {
            res.push(
                prereq_map
                    .get(&query[1])
                    .is_some_and(|prereqs| prereqs.contains(&query[0])),
            );
        }
        res
    }

    fn dfs(
        crs: i32,
        adj: &HashMap<i32, Vec<i32>>,
        prereq_map: &mut HashMap<i32, HashSet<i32>>,
    ) -> HashSet<i32> {
        if !prereq_map.contains_key(&crs) {
            let mut prereqs = HashSet::new();
            if let Some(direct_prereqs) = adj.get(&crs) {
                for &pre in direct_prereqs {
                    prereqs.extend(Self::dfs(pre, adj, prereq_map));
                }
            }
            prereq_map.insert(crs, prereqs);
        }

        prereq_map.get_mut(&crs).unwrap().insert(crs);
        prereq_map.get(&crs).cloned().unwrap()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::check_if_prerequisite(2, vec![vec![1, 0]], vec![vec![0, 1], vec![1, 0]]),
            vec![false, true]
        );
        assert_eq!(
            Solution::check_if_prerequisite(2, Vec::new(), vec![vec![1, 0], vec![0, 1]]),
            vec![false, false]
        );
        assert_eq!(
            Solution::check_if_prerequisite(
                3,
                vec![vec![1, 2], vec![1, 0], vec![2, 0]],
                vec![vec![1, 0], vec![1, 2]]
            ),
            vec![true, true]
        );
    }
}
