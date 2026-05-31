struct Solution;

use std::collections::HashSet;

impl Solution {
    fn partition_backtrack(
        idx: usize,
        count: i32,
        curr_sum: i32,
        nums: &[i32],
        target: i32,
        k: i32,
        visited: &mut HashSet<usize>,
    ) -> bool {
        if count == k {
            return true;
        }

        if target == curr_sum {
            return Self::partition_backtrack(0, count + 1, 0, nums, target, k, visited);
        }

        for i in idx..nums.len() {
            if i > 0 && !visited.contains(&(i - 1)) && nums[i] == nums[i - 1] {
                continue;
            }
            if visited.contains(&i) || curr_sum + nums[i] > target {
                continue;
            }

            visited.insert(i);
            if Self::partition_backtrack(i + 1, count, curr_sum + nums[i], nums, target, k, visited)
            {
                return true;
            }
            visited.remove(&i);
        }

        false
    }

    pub fn can_partition_k_subsets(mut nums: Vec<i32>, k: i32) -> bool {
        let total: i32 = nums.iter().sum();
        if total % k != 0 {
            return false;
        }

        nums.sort_by(|a, b| b.cmp(a));
        let target = total / k;
        let mut visited = HashSet::new();
        Self::partition_backtrack(0, 0, 0, &nums, target, k, &mut visited)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::can_partition_k_subsets(vec![4, 3, 2, 3, 5, 2, 1], 4),
            true
        );
        assert_eq!(
            Solution::can_partition_k_subsets(vec![1, 2, 3, 4], 3),
            false
        );
    }
}
