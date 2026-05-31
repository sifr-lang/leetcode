struct Solution;

impl Solution {
    pub fn min_meeting_rooms(intervals: Vec<Vec<i32>>) -> i32 {
        let mut start: Vec<i32> = intervals.iter().map(|interval| interval[0]).collect();
        let mut end: Vec<i32> = intervals.iter().map(|interval| interval[1]).collect();
        start.sort();
        end.sort();

        let mut result = 0;
        let mut count = 0;
        let mut s = 0;
        let mut e = 0;
        while s < intervals.len() {
            if start[s] < end[e] {
                s += 1;
                count += 1;
            } else {
                e += 1;
                count -= 1;
            }
            result = result.max(count);
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
            Solution::min_meeting_rooms(vec![vec![0, 30], vec![5, 10], vec![15, 20]]),
            2
        );
        assert_eq!(
            Solution::min_meeting_rooms(vec![vec![7, 10], vec![2, 4]]),
            1
        );
    }
}
