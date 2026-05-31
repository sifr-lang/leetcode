fn can_split(nums: &[i32], m: i32, largest: i32) -> bool {
    let mut subarray = 0;
    let mut cur_sum = 0;
    for &num in nums {
        cur_sum += num;
        if cur_sum > largest {
            subarray += 1;
            cur_sum = num;
        }
    }
    subarray + 1 <= m
}

pub fn split_array(nums: Vec<i32>, m: i32) -> i32 {
    let mut l = *nums.iter().max().unwrap();
    let mut r: i32 = nums.iter().sum();
    let mut res = r;

    while l <= r {
        let mid = l + ((r - l) / 2);
        if can_split(&nums, m, mid) {
            res = mid;
            r = mid - 1;
        } else {
            l = mid + 1;
        }
    }

    res
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(split_array(vec![7, 2, 5, 10, 8], 2), 18);
    }
}
