use std::collections::HashSet;

struct Solution;

impl Solution {
    pub fn can_finish(num_courses: i32, prerequisites: Vec<Vec<i32>>) -> bool {
        let mut pre_map = vec![Vec::new(); num_courses as usize];
        for edge in prerequisites {
            pre_map[edge[0] as usize].push(edge[1] as usize);
        }

        let mut visiting = HashSet::new();
        for course in 0..num_courses as usize {
            if !Self::dfs(course, &mut pre_map, &mut visiting) {
                return false;
            }
        }
        true
    }

    fn dfs(course: usize, pre_map: &mut [Vec<usize>], visiting: &mut HashSet<usize>) -> bool {
        if visiting.contains(&course) {
            return false;
        }
        if pre_map[course].is_empty() {
            return true;
        }

        visiting.insert(course);
        let prerequisites = pre_map[course].clone();
        for pre in prerequisites {
            if !Self::dfs(pre, pre_map, visiting) {
                return false;
            }
        }
        visiting.remove(&course);
        pre_map[course].clear();
        true
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::can_finish(2, vec![vec![1, 0]]), true);
        assert_eq!(Solution::can_finish(2, vec![vec![1, 0], vec![0, 1]]), false);
    }
}
