struct Solution;

use std::cmp::Ordering::{Equal, Greater, Less};

impl Solution {
    pub fn min_eating_speed(piles: Vec<i32>, h: i32) -> i32 {
        let max_piles = *piles.iter().max().unwrap() as usize;
        let (mut l, mut r) = (1, max_piles);
        let mut k = max_piles;

        while l <= r {
            let m = l + (r - l) / 2;
            let hrs: usize = piles
                .iter()
                .map(|&num_bananas| ((num_bananas - 1) as usize / m) + 1)
                .sum();

            match hrs.cmp(&(h as usize)) {
                Less | Equal => {
                    k = k.min(m);
                    r = m - 1;
                }
                Greater => l = m + 1,
            }
        }

        k as i32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::min_eating_speed(vec![3, 6, 7, 11], 8), 4);
        assert_eq!(Solution::min_eating_speed(vec![30, 11, 23, 4, 20], 5), 30);
    }
}
