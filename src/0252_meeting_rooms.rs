struct Solution;

impl Solution {
    pub fn can_attend_meetings(mut intervals: Vec<Vec<i32>>) -> bool {
        intervals.sort_by_key(|interval| interval[0]);

        for index in 1..intervals.len() {
            if intervals[index - 1][1] > intervals[index][0] {
                return false;
            }
        }
        true
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::can_attend_meetings(vec![vec![0, 30], vec![5, 10], vec![15, 20]]),
            false
        );
        assert_eq!(
            Solution::can_attend_meetings(vec![vec![7, 10], vec![2, 4]]),
            true
        );
    }
}
