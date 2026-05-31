use std::collections::HashMap;

struct Solution;

impl Solution {
    pub fn total_fruit(fruits: Vec<i32>) -> i32 {
        let mut count = HashMap::new();
        let (mut left, mut total, mut res) = (0, 0, 0);

        for fruit in &fruits {
            *count.entry(*fruit).or_insert(0) += 1;
            total += 1;

            while count.len() > 2 {
                let f = fruits[left];
                match count.remove(&f) {
                    Some(v) if v > 1 => {
                        count.insert(f, v - 1);
                    }
                    _ => {}
                }
                total -= 1;
                left += 1;
            }

            res = res.max(total);
        }

        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(Solution::total_fruit(vec![1, 2, 1]), 3);
        assert_eq!(Solution::total_fruit(vec![0, 1, 2, 2]), 3);
        assert_eq!(Solution::total_fruit(vec![1, 2, 3, 2, 2]), 4);
    }
}
