struct Solution;

use std::collections::HashMap;

impl Solution {
    pub fn top_k_frequent(nums: Vec<i32>, k: i32) -> Vec<i32> {
        let mut count = HashMap::new();
        let mut order = Vec::new();

        for num in nums.iter().copied() {
            if !count.contains_key(&num) {
                order.push(num);
            }
            *count.entry(num).or_insert(0usize) += 1;
        }

        let mut freq = vec![Vec::new(); nums.len() + 1];
        for num in order {
            freq[count[&num]].push(num);
        }

        let mut result = Vec::new();
        for bucket in freq.iter().rev() {
            result.extend(bucket.iter().copied());
            if result.len() == k as usize {
                return result;
            }
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
            Solution::top_k_frequent(vec![1, 1, 1, 2, 2, 3], 2),
            vec![1, 2]
        );
        assert_eq!(Solution::top_k_frequent(vec![1], 1), vec![1]);
        assert_eq!(
            Solution::top_k_frequent(vec![1, 2, 1, 2, 1, 2, 3, 1, 3, 2], 2),
            vec![1, 2]
        );
    }
}
