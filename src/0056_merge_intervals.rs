struct Solution;

impl Solution {
    pub fn merge(mut intervals: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
        intervals.sort_by(|a, b| a[0].cmp(&b[0]));
        let acc = vec![intervals.first().unwrap().clone()];
        intervals.into_iter().skip(1).fold(acc, |mut acc, e| {
            let last = acc.last().unwrap();
            if e[0] <= last[1] {
                acc.last_mut().unwrap()[1] = last[1].max(e[1]);
            } else {
                acc.push(e)
            }
            acc
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::merge(vec![vec![1, 3], vec![2, 6], vec![8, 10], vec![15, 18]]),
            vec![vec![1, 6], vec![8, 10], vec![15, 18]]
        );
    }
}
