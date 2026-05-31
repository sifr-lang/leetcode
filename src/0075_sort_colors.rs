struct Solution;

impl Solution {
    pub fn sort_colors(nums: &mut Vec<i32>) {
        let mut count = [0; 3];
        for num in nums.iter() {
            count[*num as usize] += 1;
        }
        let mut i = 0;
        for (num, c) in count.iter().enumerate() {
            for _ in 0..*c {
                nums[i] = num as i32;
                i += 1;
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut arg0 = vec![2, 0, 2, 1, 1, 0];
        Solution::sort_colors(&mut arg0);
        assert_eq!(arg0, vec![0, 0, 1, 1, 2, 2]);
        let mut arg0 = vec![2, 0, 1];
        Solution::sort_colors(&mut arg0);
        assert_eq!(arg0, vec![0, 1, 2]);
    }
}
