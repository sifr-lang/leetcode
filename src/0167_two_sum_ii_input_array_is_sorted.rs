use std::cmp::Ordering::{Equal, Greater, Less};

struct Solution;

impl Solution {
    pub fn two_sum(numbers: Vec<i32>, target: i32) -> Vec<i32> {
        let (mut l, mut r) = (0, numbers.len() - 1);
        while l < r {
            match (numbers[l] + numbers[r]).cmp(&target) {
                Less => l += 1,
                Greater => r -= 1,
                Equal => return vec![l as i32 + 1, r as i32 + 1],
            }
        }
        unreachable!("Test did not follow the constraints!")
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(Solution::two_sum(vec![2, 7, 11, 15], 9), vec![1, 2]);
        assert_eq!(Solution::two_sum(vec![2, 3, 4], 6), vec![1, 3]);
    }
}
