use std::collections::BTreeMap;

struct Solution;

impl Solution {
    pub fn max_count(banned: Vec<i32>, n: i32, max_sum: i32) -> i32 {
        let mut nums = BTreeMap::new();
        for x in 1..=n {
            nums.insert(x, 1);
        }
        for i in banned {
            nums.remove(&i);
        }

        let mut sum = 0;
        let mut count = 0;
        for i in nums.keys() {
            sum += *i;
            if sum <= max_sum {
                count += 1;
            } else {
                break;
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
        assert_eq!(Solution::max_count(vec![1, 6, 5], 5, 6), 2);
        assert_eq!(Solution::max_count(vec![1, 2, 3, 4, 5, 6, 7], 8, 1), 0);
        assert_eq!(Solution::max_count(vec![11], 7, 50), 7);
    }
}
