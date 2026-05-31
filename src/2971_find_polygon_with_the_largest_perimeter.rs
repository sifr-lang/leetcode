use std::collections::BinaryHeap;

struct Solution;

impl Solution {
    pub fn largest_perimeter(nums: Vec<i32>) -> i64 {
        let mut cur_sum: i64 = nums.iter().map(|n| i64::from(*n)).sum();
        let mut nums: BinaryHeap<i64> = nums.into_iter().map(i64::from).collect();

        while let Some(max_side) = nums.peek().copied() {
            if cur_sum > max_side * 2 {
                break;
            }
            cur_sum -= nums.pop().unwrap();
        }

        if nums.len() > 2 {
            cur_sum
        } else {
            -1
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn main_asserts() {
        assert_eq!(Solution::largest_perimeter(vec![5, 5, 5]), 15);
        assert_eq!(Solution::largest_perimeter(vec![1, 12, 1, 2, 5, 50, 3]), 12);
    }
}
