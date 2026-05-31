fn bin_search(nums: &[i32], target: i32, left_bias: bool) -> i32 {
    let mut l = 0_usize;
    let mut r = nums.len();
    let mut i = -1;

    while l < r {
        let m = (l + r) / 2;
        if target > nums[m] {
            l = m + 1;
        } else if target < nums[m] {
            r = m;
        } else {
            i = m as i32;
            if left_bias {
                r = m;
            } else {
                l = m + 1;
            }
        }
    }

    i
}

pub fn search_range(nums: Vec<i32>, target: i32) -> Vec<i32> {
    let left = bin_search(&nums, target, true);
    let right = bin_search(&nums, target, false);
    vec![left, right]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(search_range(vec![5, 7, 7, 8, 8, 10], 8), vec![3, 4]);
        assert_eq!(search_range(vec![5, 7, 7, 8, 8, 10], 6), vec![-1, -1]);
    }
}
