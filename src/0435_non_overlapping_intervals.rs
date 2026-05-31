struct Solution;

impl Solution {
    pub fn erase_overlap_intervals(mut intervals: Vec<Vec<i32>>) -> i32 {
        intervals.sort_by(|a, b| a[0].cmp(&b[0]));

        let mut res = 0;
        let mut prev_end = intervals[0][1];

        for interval in intervals.iter().skip(1) {
            let start = interval[0];
            let end = interval[1];

            if start >= prev_end {
                prev_end = end;
            } else {
                res += 1;
                prev_end = prev_end.min(end);
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
            Solution::erase_overlap_intervals(vec![vec![1, 2], vec![2, 3], vec![3, 4], vec![1, 3]]),
            1
        );
        assert_eq!(
            Solution::erase_overlap_intervals(vec![vec![1, 2], vec![1, 2], vec![1, 2]]),
            2
        );
    }
}
