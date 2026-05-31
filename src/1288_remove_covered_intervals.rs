struct Solution;

impl Solution {
    pub fn remove_covered_intervals(mut intervals: Vec<Vec<i32>>) -> i32 {
        intervals
            .sort_by(|left, right| left[0].cmp(&right[0]).then_with(|| right[1].cmp(&left[1])));

        let mut covered = 0;
        let mut max_right = 0;
        for interval in &intervals {
            let right = interval[1];
            if right > max_right {
                max_right = right;
            } else {
                covered += 1;
            }
        }

        intervals.len() as i32 - covered
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::remove_covered_intervals(vec![vec![1, 4], vec![3, 6], vec![2, 8]]),
            2
        );
    }
}
