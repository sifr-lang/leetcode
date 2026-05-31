fn check_pair(nums: &[i32], p: i32, mid: i32) -> bool {
    let mut count = 0;
    let mut i = 0;

    while i < nums.len() - 1 {
        if nums[i + 1] - nums[i] <= mid {
            count += 1;
            i += 2;
        } else {
            i += 1;
        }
    }

    count >= p
}

pub fn minimize_max(mut nums: Vec<i32>, p: i32) -> i32 {
    nums.sort();
    let mut left = 0;
    let mut right = nums[nums.len() - 1] - nums[0];

    while left < right {
        let mid = (left + right) / 2;
        if check_pair(&nums, p, mid) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }

    left
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(minimize_max(vec![10, 1, 2, 7, 1, 3], 2), 1);
    }
}
