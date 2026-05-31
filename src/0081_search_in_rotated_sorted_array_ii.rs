pub fn search(nums: Vec<i32>, target: i32) -> bool {
    let mut left = 0_usize;
    let mut right = nums.len().saturating_sub(1);

    while left <= right && !nums.is_empty() {
        let mid = left + (right - left) / 2;
        if nums[mid] == target {
            return true;
        }

        if nums[left] < nums[mid] {
            if nums[left] <= target && target < nums[mid] {
                if mid == 0 {
                    break;
                }
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else if nums[left] > nums[mid] {
            if nums[mid] < target && target <= nums[right] {
                left = mid + 1;
            } else if mid == 0 {
                break;
            } else {
                right = mid - 1;
            }
        } else {
            left += 1;
        }
    }

    false
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(search(vec![2, 5, 6, 0, 0, 1, 2], 0), true);
        assert_eq!(search(vec![2, 5, 6, 0, 0, 1, 2], 3), false);
    }
}
