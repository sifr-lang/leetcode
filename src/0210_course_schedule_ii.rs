struct Solution;

use std::collections::HashSet;

impl Solution {
    fn course_dfs(
        crs: i32,
        prereq: &[Vec<i32>],
        output: &mut Vec<i32>,
        visit: &mut HashSet<i32>,
        cycle: &mut HashSet<i32>,
    ) -> bool {
        if cycle.contains(&crs) {
            return false;
        }
        if visit.contains(&crs) {
            return true;
        }

        cycle.insert(crs);
        for &pre in &prereq[crs as usize] {
            if !Self::course_dfs(pre, prereq, output, visit, cycle) {
                return false;
            }
        }
        cycle.remove(&crs);
        visit.insert(crs);
        output.push(crs);
        true
    }

    pub fn find_order(num_courses: i32, prerequisites: Vec<Vec<i32>>) -> Vec<i32> {
        let mut prereq = vec![Vec::new(); num_courses as usize];
        for edge in prerequisites {
            prereq[edge[0] as usize].push(edge[1]);
        }

        let mut output = Vec::new();
        let mut visit = HashSet::new();
        let mut cycle = HashSet::new();
        for c in 0..num_courses {
            if !Self::course_dfs(c, &prereq, &mut output, &mut visit, &mut cycle) {
                return Vec::new();
            }
        }
        output
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::find_order(2, vec![vec![1, 0]]), vec![0, 1]);
        assert_eq!(
            Solution::find_order(4, vec![vec![1, 0], vec![2, 0], vec![3, 1], vec![3, 2]]),
            vec![0, 1, 2, 3]
        );
        assert_eq!(Solution::find_order(1, vec![]), vec![0]);
    }
}
