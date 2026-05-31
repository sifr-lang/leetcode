struct Solution;

impl Solution {
    fn detonation_dfs(node: usize, vis: &mut [bool], graph: &[Vec<usize>]) -> i32 {
        vis[node] = true;
        let mut count = 1;

        for &nbh in &graph[node] {
            if !vis[nbh] {
                count += Self::detonation_dfs(nbh, vis, graph);
            }
        }

        count
    }

    pub fn maximum_detonation(bombs: Vec<Vec<i32>>) -> i32 {
        let n = bombs.len();
        let mut graph = vec![Vec::new(); n];

        for i in 0..n {
            for j in 0..n {
                if i != j {
                    let x1 = bombs[i][0];
                    let y1 = bombs[i][1];
                    let r1 = bombs[i][2];
                    let x2 = bombs[j][0];
                    let y2 = bombs[j][1];
                    let dst = f64::from((x1 - x2).pow(2) + (y1 - y2).pow(2)).sqrt();

                    if dst <= f64::from(r1) {
                        graph[i].push(j);
                    }
                }
            }
        }

        let mut detonated = 0;
        for i in 0..n {
            let mut visited = vec![false; n];
            detonated = detonated.max(Self::detonation_dfs(i, &mut visited, &graph));
        }
        detonated
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::maximum_detonation(vec![vec![2, 1, 3], vec![6, 1, 4]]),
            2
        );
        assert_eq!(
            Solution::maximum_detonation(vec![vec![1, 1, 5], vec![10, 10, 5]]),
            1
        );
        assert_eq!(
            Solution::maximum_detonation(vec![
                vec![1, 2, 3],
                vec![2, 3, 1],
                vec![3, 4, 2],
                vec![4, 5, 3],
                vec![5, 6, 4]
            ]),
            5
        );
    }
}
