struct Solution;

impl Solution {
    pub fn rearrange_array(mut nums: Vec<i32>) -> Vec<i32> {
        nums.sort();

        let n = nums.len();
        let mut ans = vec![0; n];
        let mut write = 0;
        let mut read = 0;

        while write < n && read < n {
            ans[write] = nums[read];
            write += 2;
            read += 1;
        }

        write = 1;
        while write < n && read < n {
            ans[write] = nums[read];
            write += 2;
            read += 1;
        }

        ans
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::rearrange_array(vec![3, 1, -2, -5, 2, -4]),
            vec![-5, 1, -4, 2, -2, 3]
        );
    }
}
