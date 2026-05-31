struct Solution;

impl Solution {
    pub fn merge(nums1: &mut Vec<i32>, m: i32, nums2: &mut Vec<i32>, n: i32) {
        let (mut m, mut n) = (m as isize, n as isize);
        // Last index nums1
        let mut last = m + n - 1;

        // Merge in reverse order
        while m > 0 && n > 0 {
            if nums1[(m - 1) as usize] > nums2[(n - 1) as usize] {
                nums1[last as usize] = nums1[(m - 1) as usize];
                m -= 1;
            } else {
                nums1[last as usize] = nums2[(n - 1) as usize];
                n -= 1;
            }
            last -= 1
        }

        // Fill nums1 with leftover nums2 elements
        while n > 0 {
            nums1[last as usize] = nums2[(n - 1) as usize];
            n -= 1;
            last -= 1;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        let mut arg0 = vec![1, 2, 3, 0, 0, 0];
        let mut arg1 = 3;
        let mut arg2 = vec![2, 5, 6];
        let mut arg3 = 3;
        Solution::merge(&mut arg0, arg1, &mut arg2, arg3);
        assert_eq!(arg0, vec![1, 2, 2, 3, 5, 6]);
        let mut arg0 = vec![1];
        let mut arg1 = 1;
        let mut arg2 = vec![];
        let mut arg3 = 0;
        Solution::merge(&mut arg0, arg1, &mut arg2, arg3);
        assert_eq!(arg0, vec![1]);
        let mut arg0 = vec![0];
        let mut arg1 = 0;
        let mut arg2 = vec![1];
        let mut arg3 = 1;
        Solution::merge(&mut arg0, arg1, &mut arg2, arg3);
        assert_eq!(arg0, vec![1]);
    }
}
