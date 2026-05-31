use std::collections::HashMap;

fn lis_dfs(
    i: usize,
    nums: &[i32],
    dp: &mut HashMap<usize, (i32, i32)>,
    len_lis: &mut i32,
    res: &mut i32,
) -> (i32, i32) {
    if let Some(&cached) = dp.get(&i) {
        return cached;
    }

    let mut max_len = 1;
    let mut max_cnt = 1;
    for j in i + 1..nums.len() {
        if nums[j] > nums[i] {
            let (length, count) = lis_dfs(j, nums, dp, len_lis, res);
            if length + 1 > max_len {
                max_len = length + 1;
                max_cnt = count;
            } else if length + 1 == max_len {
                max_cnt += count;
            }
        }
    }

    if max_len > *len_lis {
        *len_lis = max_len;
        *res = max_cnt;
    } else if max_len == *len_lis {
        *res += max_cnt;
    }

    dp.insert(i, (max_len, max_cnt));
    (max_len, max_cnt)
}

pub fn find_number_of_lis(nums: Vec<i32>) -> i32 {
    let mut dp = HashMap::new();
    let mut len_lis = 0;
    let mut res = 0;

    for i in 0..nums.len() {
        lis_dfs(i, &nums, &mut dp, &mut len_lis, &mut res);
    }

    res
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(find_number_of_lis(vec![1, 3, 5, 4, 7]), 2);
        assert_eq!(find_number_of_lis(vec![2, 2, 2, 2, 2]), 5);
    }
}
