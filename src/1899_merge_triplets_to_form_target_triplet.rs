struct Solution;

use std::collections::HashSet;

impl Solution {
    pub fn merge_triplets(triplets: Vec<Vec<i32>>, target: Vec<i32>) -> bool {
        let mut good = HashSet::new();

        for t in triplets {
            if t[0] > target[0] || t[1] > target[1] || t[2] > target[2] {
                continue;
            }
            for (i, &v) in t.iter().enumerate() {
                if v == target[i] {
                    good.insert(i);
                }
            }
        }

        good.len() == 3
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::merge_triplets(
                vec![vec![2, 5, 3], vec![1, 8, 4], vec![1, 7, 5]],
                vec![2, 7, 5]
            ),
            true
        );
    }
}
