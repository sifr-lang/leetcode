struct Solution;

impl Solution {
    pub fn wiggle_sort(nums: &mut Vec<i32>) {
        for i in 1..nums.len() {
            if (i % 2 == 1 && nums[i] < nums[i - 1]) || (i % 2 == 0 && nums[i] > nums[i - 1]) {
                nums.swap(i, i - 1);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut arg0 = vec![3, 5, 2, 1, 6, 4];
        Solution::wiggle_sort(&mut arg0);
        assert_eq!(arg0, vec![3, 5, 1, 6, 2, 4]);
        let mut arg0 = vec![6, 6, 5, 6, 3, 8];
        Solution::wiggle_sort(&mut arg0);
        assert_eq!(arg0, vec![6, 6, 5, 6, 3, 8]);
    }
}
