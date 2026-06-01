pub fn insert(intervals: &Vec<Vec<i32>>, new_interval: &Vec<i32>) -> Vec<Vec<i32>> {
    let mut res: Vec<Vec<i32>> = Vec::with_capacity(intervals.len() + 1);
    let mut curr_start = new_interval[0];
    let mut curr_end = new_interval[1];

    for i in 0..intervals.len() {
        let interval = &intervals[i];
        if curr_end < interval[0] {
            res.push(vec![curr_start, curr_end]);
            res.extend(intervals[i..].iter().cloned());
            return res;
        } else if curr_start > interval[1] {
            res.push(interval.clone());
        } else {
            curr_start = curr_start.min(interval[0]);
            curr_end = curr_end.max(interval[1]);
        }
    }

    res.push(vec![curr_start, curr_end]);

    res
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            insert(&vec![vec![1, 3], vec![6, 9]], &vec![2, 5]),
            vec![vec![1, 5], vec![6, 9]]
        );
        assert_eq!(
            insert(
                &vec![
                    vec![1, 2],
                    vec![3, 5],
                    vec![6, 7],
                    vec![8, 10],
                    vec![12, 16]
                ],
                &vec![4, 8]
            ),
            vec![vec![1, 2], vec![3, 10], vec![12, 16]]
        );
    }
}
