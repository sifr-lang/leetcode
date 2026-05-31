use std::collections::{BTreeMap, BTreeSet, HashMap, HashSet};

struct Solution;

impl Solution {
    pub fn find_all_people(_n: i32, meetings: Vec<Vec<i32>>, first_person: i32) -> Vec<i32> {
        let mut secrets = BTreeSet::from([0, first_person]);
        let mut time_map: BTreeMap<i32, HashMap<i32, Vec<i32>>> = BTreeMap::new();

        for meeting in meetings {
            let src = meeting[0];
            let dst = meeting[1];
            let t = meeting[2];
            let adj = time_map.entry(t).or_default();
            adj.entry(src).or_default().push(dst);
            adj.entry(dst).or_default().push(src);
        }

        for adj in time_map.values() {
            let mut visit = HashSet::new();
            let starts: Vec<i32> = adj.keys().copied().collect();
            for src in starts {
                if secrets.contains(&src) {
                    Self::dfs(src, adj, &mut visit, &mut secrets);
                }
            }
        }

        secrets.into_iter().collect()
    }

    fn dfs(
        src: i32,
        adj: &HashMap<i32, Vec<i32>>,
        visit: &mut HashSet<i32>,
        secrets: &mut BTreeSet<i32>,
    ) {
        if visit.contains(&src) {
            return;
        }
        visit.insert(src);
        secrets.insert(src);
        if let Some(neighbors) = adj.get(&src) {
            for nei in neighbors {
                Self::dfs(*nei, adj, visit, secrets);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::find_all_people(6, vec![vec![1, 2, 5], vec![2, 3, 8], vec![1, 5, 10]], 1),
            vec![0, 1, 2, 3, 5]
        );
        assert_eq!(
            Solution::find_all_people(4, vec![vec![3, 1, 3], vec![1, 2, 2], vec![0, 3, 3]], 3),
            vec![0, 1, 3]
        );
        assert_eq!(
            Solution::find_all_people(5, vec![vec![3, 4, 2], vec![1, 2, 1], vec![2, 3, 1]], 1),
            vec![0, 1, 2, 3, 4]
        );
    }
}
