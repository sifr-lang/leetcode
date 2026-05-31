use std::cmp::Ordering::{Equal, Greater, Less};

struct Solution;

impl Solution {
    pub fn three_sum(mut numbers: Vec<i32>) -> Vec<Vec<i32>> {
        numbers.sort_unstable();

        let mut ans: Vec<Vec<i32>> = Vec::new();

        for i in 0..numbers.len() {
            if i > 0 && numbers[i] == numbers[i - 1] {
                continue;
            }

            let (mut l, mut r) = (i + 1, numbers.len() - 1);

            while l < r {
                match (numbers[i] + numbers[l] + numbers[r]).cmp(&0) {
                    Less => l += 1,
                    Greater => r -= 1,
                    Equal => {
                        ans.push(vec![numbers[i], numbers[l], numbers[r]]);
                        l += 1;
                        while numbers[l] == numbers[l - 1] && l < r {
                            l += 1;
                        }
                        r -= 1;
                        while numbers[r] == numbers[r + 1] && l < r {
                            r -= 1;
                        }
                    }
                }
            }
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
            Solution::three_sum(vec![-1, 0, 1, 2, -1, -4]),
            vec![vec![-1, -1, 2], vec![-1, 0, 1]]
        );
    }
}
