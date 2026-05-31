struct Solution;

use std::collections::BTreeMap;

impl Solution {
    fn backtrack(
        nums_len: usize,
        perm: &mut Vec<i32>,
        counter: &mut BTreeMap<i32, i32>,
        result: &mut Vec<Vec<i32>>,
    ) {
        if perm.len() == nums_len {
            result.push(perm.clone());
        }

        let keys: Vec<i32> = counter.keys().copied().collect();
        for n in keys {
            if counter[&n] == 0 {
                continue;
            }
            perm.push(n);
            *counter.get_mut(&n).unwrap() -= 1;
            Self::backtrack(nums_len, perm, counter, result);
            perm.pop();
            *counter.get_mut(&n).unwrap() += 1;
        }
    }

    pub fn permute_unique(nums: Vec<i32>) -> Vec<Vec<i32>> {
        let mut result = Vec::new();
        let mut counter = BTreeMap::new();
        for n in &nums {
            *counter.entry(*n).or_insert(0) += 1;
        }

        let mut perm = Vec::new();
        Self::backtrack(nums.len(), &mut perm, &mut counter, &mut result);
        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::permute_unique(vec![1, 1, 2]),
            vec![vec![1, 1, 2], vec![1, 2, 1], vec![2, 1, 1]]
        );
    }
}
