struct Solution;

impl Solution {
    pub fn clone_graph(adjacency: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
        let mut cloned = Vec::with_capacity(adjacency.len());
        for neighbors in adjacency {
            let mut row = neighbors;
            row.sort_unstable();
            cloned.push(row);
        }
        cloned
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::clone_graph(vec![vec![2, 4], vec![1, 3], vec![2, 4], vec![1, 3]]),
            vec![vec![2, 4], vec![1, 3], vec![2, 4], vec![1, 3]]
        );
        assert_eq!(Solution::clone_graph(vec![vec![]]), vec![Vec::<i32>::new()]);
        assert_eq!(Solution::clone_graph(Vec::<Vec<i32>>::new()), Vec::<Vec<i32>>::new());
    }
}
