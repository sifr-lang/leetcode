struct Solution;

impl Solution {
    pub fn min_cost_connect_points(points: Vec<Vec<i32>>) -> i32 {
        let n = points.len();
        let mut in_tree = vec![false; n];
        let mut min_dist = vec![i32::MAX; n];
        min_dist[0] = 0;
        let mut result = 0;
        for _ in 0..n {
            let mut current = 0;
            for i in 0..n {
                if !in_tree[i] && (in_tree[current] || min_dist[i] < min_dist[current]) {
                    current = i;
                }
            }
            in_tree[current] = true;
            result += min_dist[current];
            for next in 0..n {
                let distance = (points[current][0] - points[next][0]).abs()
                    + (points[current][1] - points[next][1]).abs();
                if !in_tree[next] && distance < min_dist[next] {
                    min_dist[next] = distance;
                }
            }
        }
        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::min_cost_connect_points(vec![
                vec![0, 0],
                vec![2, 2],
                vec![3, 10],
                vec![5, 2],
                vec![7, 0]
            ]),
            20
        );
        assert_eq!(
            Solution::min_cost_connect_points(vec![vec![3, 12], vec![-2, 5], vec![-4, 1]]),
            18
        );
    }
}
