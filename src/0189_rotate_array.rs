struct Solution;

impl Solution {
    pub fn rotate(nums: &mut Vec<i32>, k: i32) {
        let k = k as usize % nums.len();
        nums.reverse();
        nums[..k].reverse();
        nums[k..].reverse();
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        let mut arg0 = vec![1, 2, 3, 4, 5, 6, 7];
        let mut arg1 = 3;
        Solution::rotate(&mut arg0, arg1);
        assert_eq!(arg0, vec![5, 6, 7, 1, 2, 3, 4]);
        let mut arg0 = vec![-1, -100, 3, 99];
        let mut arg1 = 2;
        Solution::rotate(&mut arg0, arg1);
        assert_eq!(arg0, vec![3, 99, -1, -100]);
    }
}
