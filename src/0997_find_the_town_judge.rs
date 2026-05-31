use std::collections::HashMap;

struct Solution;

impl Solution {
    pub fn find_judge(n: i32, trust: Vec<Vec<i32>>) -> i32 {
        let mut delta = HashMap::<i32, i32>::new();

        for edge in trust {
            *delta.entry(edge[0]).or_insert(0) -= 1;
            *delta.entry(edge[1]).or_insert(0) += 1;
        }

        for i in 1..=n {
            if delta.get(&i).copied().unwrap_or(0) == n - 1 {
                return i;
            }
        }
        -1
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::find_judge(2, vec![vec![1, 2]]), 2);
        assert_eq!(Solution::find_judge(3, vec![vec![1, 3], vec![2, 3]]), 3);
        assert_eq!(
            Solution::find_judge(3, vec![vec![1, 3], vec![2, 3], vec![3, 1]]),
            -1
        );
    }
}
