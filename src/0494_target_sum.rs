use std::collections::HashMap;

fn target_backtrack(
    i: usize,
    total: i32,
    nums: &[i32],
    target: i32,
    dp: &mut HashMap<(usize, i32), i32>,
) -> i32 {
    if i == nums.len() {
        return i32::from(total == target);
    }
    if let Some(&cached) = dp.get(&(i, total)) {
        return cached;
    }

    let ans = target_backtrack(i + 1, total + nums[i], nums, target, dp)
        + target_backtrack(i + 1, total - nums[i], nums, target, dp);
    dp.insert((i, total), ans);
    ans
}

pub fn find_target_sum_ways(nums: Vec<i32>, target: i32) -> i32 {
    let mut dp = HashMap::new();
    target_backtrack(0, 0, &nums, target, &mut dp)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(find_target_sum_ways(vec![1, 1, 1, 1, 1], 3), 5);
    }
}
