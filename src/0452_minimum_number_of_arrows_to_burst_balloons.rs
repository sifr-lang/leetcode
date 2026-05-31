struct Solution;

impl Solution {
    pub fn find_min_arrow_shots(mut points: Vec<Vec<i32>>) -> i32 {
        points.sort();

        let mut res = points.len() as i32;
        let mut prev = points[0].clone();

        for curr in points.iter().skip(1) {
            if curr[0] <= prev[1] {
                res -= 1;
                prev = vec![curr[0], curr[1].min(prev[1])];
            } else {
                prev = curr.clone();
            }
        }

        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::find_min_arrow_shots(vec![vec![10, 16], vec![2, 8], vec![1, 6], vec![7, 12]]),
            2
        );
    }
}
