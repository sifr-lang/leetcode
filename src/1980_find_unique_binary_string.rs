struct Solution;

impl Solution {
    pub fn find_different_binary_string(nums: Vec<String>) -> String {
        let mut out = String::new();
        for (i, row) in nums.iter().enumerate() {
            let ch = row.as_bytes()[i] as char;
            out.push(if ch == '0' { '1' } else { '0' });
        }
        out
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let nums1 = vec![String::from("01"), String::from("10")];
        let ans1 = Solution::find_different_binary_string(nums1.clone());
        assert_eq!(ans1.len(), nums1.len());
        assert!(!nums1.contains(&ans1));
        let nums2 = vec![String::from("00"), String::from("01")];
        let ans2 = Solution::find_different_binary_string(nums2.clone());
        assert_eq!(ans2.len(), nums2.len());
        assert!(!nums2.contains(&ans2));
        let nums3 = vec![
            String::from("111"),
            String::from("011"),
            String::from("001"),
        ];
        let ans3 = Solution::find_different_binary_string(nums3.clone());
        assert_eq!(ans3.len(), nums3.len());
        assert!(!nums3.contains(&ans3));
    }
}
