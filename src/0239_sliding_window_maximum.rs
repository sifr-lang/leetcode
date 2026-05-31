use std::collections::VecDeque;

struct Solution;

impl Solution {
    pub fn max_sliding_window(nums: Vec<i32>, k: i32) -> Vec<i32> {
        let mut output = vec![];
        let mut q: VecDeque<usize> = VecDeque::new();

        let (mut l, mut r) = (0, 0);

        while r < nums.len() {
            while !q.is_empty() && nums[r] > nums[*q.back().unwrap()] {
                q.pop_back();
            }

            q.push_back(r);

            if l > *q.front().unwrap() {
                q.pop_front();
            }

            if r + 1 >= k as usize {
                output.push(nums[*q.front().unwrap()]);
                l += 1;
            }

            r += 1;
        }

        output
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::max_sliding_window(vec![1, 3, -1, -3, 5, 3, 6, 7], 3),
            vec![3, 3, 5, 5, 6, 7]
        );
        assert_eq!(Solution::max_sliding_window(vec![1], 1), vec![1]);
    }
}
