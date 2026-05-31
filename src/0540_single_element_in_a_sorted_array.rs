fn is_non_duplicate(nums: &[i32], i: usize) -> bool {
    let is_left_different = i == 0 || nums[i - 1] != nums[i];
    let is_right_different = i == nums.len() - 1 || nums[i + 1] != nums[i];
    is_left_different && is_right_different
}

pub fn single_non_duplicate(nums: Vec<i32>) -> i32 {
    if nums.len() == 1 {
        return nums[0];
    }

    let mut l = 0_usize;
    let mut r = nums.len() - 1;
    let mut mid = 0;
    while l <= r {
        mid = (l + r) / 2;
        if is_non_duplicate(&nums, mid) {
            return nums[mid];
        }

        if mid % 2 == 0 {
            if nums[mid + 1] == nums[mid] {
                l = mid + 1;
            } else if mid == 0 {
                break;
            } else {
                r = mid - 1;
            }
        } else if nums[mid + 1] == nums[mid] {
            r = mid - 1;
        } else {
            l = mid + 1;
        }
    }

    nums[mid]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(single_non_duplicate(vec![1, 1, 2, 3, 3, 4, 4, 8, 8]), 2);
    }
}
