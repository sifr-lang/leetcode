struct Solution;

impl Solution {
    pub fn num_of_subarrays(arr: Vec<i32>, k: i32, threshold: i32) -> i32 {
        let k = k as usize;
        let target = threshold * k as i32;
        let mut window: i32 = arr.iter().take(k).sum();
        let mut count = if window >= target { 1 } else { 0 };
        for i in k..arr.len() {
            window += arr[i] - arr[i - k];
            if window >= target {
                count += 1;
            }
        }
        count
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::num_of_subarrays(vec![2, 1, 5, 6, 0, 9, 8], 3, 4),
            3
        );
    }
}
