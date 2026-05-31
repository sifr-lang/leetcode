use std::collections::HashMap;

fn stone_dfs(
    i: usize,
    total: i32,
    stones: &[i32],
    stone_sum: i32,
    target: i32,
    dp: &mut HashMap<(usize, i32), i32>,
) -> i32 {
    if total >= target || i == stones.len() {
        return (total - (stone_sum - total)).abs();
    }
    if let Some(&cached) = dp.get(&(i, total)) {
        return cached;
    }

    let ans = stone_dfs(i + 1, total, stones, stone_sum, target, dp).min(stone_dfs(
        i + 1,
        total + stones[i],
        stones,
        stone_sum,
        target,
        dp,
    ));
    dp.insert((i, total), ans);
    ans
}

pub fn last_stone_weight_ii(stones: Vec<i32>) -> i32 {
    let stone_sum: i32 = stones.iter().sum();
    let target = (stone_sum + 1) / 2;
    let mut dp = HashMap::new();
    stone_dfs(0, 0, &stones, stone_sum, target, &mut dp)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(last_stone_weight_ii(vec![2, 7, 4, 1, 8, 1]), 1);
    }
}
