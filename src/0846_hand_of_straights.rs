struct Solution;

use std::cmp::Reverse;
use std::collections::{BinaryHeap, HashMap};

impl Solution {
    pub fn is_n_straight_hand(hand: Vec<i32>, group_size: i32) -> bool {
        if hand.len() as i32 % group_size != 0 {
            return false;
        }

        let mut count = HashMap::new();
        for n in hand {
            *count.entry(n).or_insert(0) += 1;
        }

        let mut min_h = BinaryHeap::new();
        for &key in count.keys() {
            min_h.push(Reverse(key));
        }

        while let Some(&Reverse(first)) = min_h.peek() {
            for i in first..first + group_size {
                if !count.contains_key(&i) {
                    return false;
                }
                *count.get_mut(&i).unwrap() -= 1;
                if count[&i] == 0 {
                    if Some(&Reverse(i)) != min_h.peek() {
                        return false;
                    }
                    min_h.pop();
                }
            }
        }

        true
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::is_n_straight_hand(vec![1, 2, 3, 6, 2, 3, 4, 7, 8], 3),
            true
        );
        assert_eq!(Solution::is_n_straight_hand(vec![1, 2, 3, 4, 5], 4), false);
    }
}
