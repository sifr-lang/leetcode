use std::collections::VecDeque;

struct Solution;

impl Solution {
    pub fn shortest_subarray(nums: Vec<i32>, k: i32) -> i32 {
        let size = nums.len();
        let mut pre = vec![0i64];
        for num in nums {
            pre.push(pre.last().copied().unwrap() + i64::from(num));
        }

        let mut ans = size + 1;
        let mut monoq = VecDeque::<usize>::new();
        for (i, val) in pre.iter().copied().enumerate() {
            while let Some(&back) = monoq.back() {
                if val <= pre[back] {
                    monoq.pop_back();
                } else {
                    break;
                }
            }
            while let Some(&front) = monoq.front() {
                if val - pre[front] >= i64::from(k) {
                    ans = ans.min(i - monoq.pop_front().unwrap());
                } else {
                    break;
                }
            }
            monoq.push_back(i);
        }

        if ans < size + 1 {
            ans as i32
        } else {
            -1
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::shortest_subarray(vec![1], 1), 1);
        assert_eq!(Solution::shortest_subarray(vec![1, 2], 4), -1);
        assert_eq!(Solution::shortest_subarray(vec![2, -1, 2], 3), 3);
    }
}
