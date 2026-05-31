pub fn delete_and_earn(nums: Vec<i32>) -> i32 {
    let upper_limit = nums.iter().copied().max().unwrap_or(0) as usize + 1;
    let mut store = vec![0; upper_limit];

    for num in nums {
        store[num as usize] += num;
    }

    let mut dp = vec![0; upper_limit];
    if upper_limit > 1 {
        dp[1] = store[1];
    }
    for i in 2..upper_limit {
        dp[i] = (dp[i - 2] + store[i]).max(dp[i - 1]);
    }

    dp[upper_limit - 1]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(delete_and_earn(vec![3, 4, 2]), 6);
        assert_eq!(delete_and_earn(vec![2, 2, 3, 3, 3, 4]), 9);
    }
}
