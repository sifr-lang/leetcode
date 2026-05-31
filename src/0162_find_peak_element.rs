pub fn find_peak_element(nums: Vec<i32>) -> i32 {
    let mut l = 0_usize;
    let mut r = nums.len() - 1;
    let mut mid = 0_usize;

    while l <= r {
        mid = (r + l) / 2;
        if mid < nums.len() - 1 && nums[mid] < nums[mid + 1] {
            l = mid + 1;
        } else if mid > 0 && nums[mid] < nums[mid - 1] {
            r = mid - 1;
        } else {
            break;
        }
    }

    mid as i32
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(find_peak_element(vec![1, 2, 3, 1]), 2);
    }
}
