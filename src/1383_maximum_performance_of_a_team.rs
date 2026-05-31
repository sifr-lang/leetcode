struct Solution;

use std::cmp::Reverse;
use std::collections::BinaryHeap;

impl Solution {
    pub fn max_performance(n: i32, speed: Vec<i32>, efficiency: Vec<i32>, k: i32) -> i32 {
        let modulo = 1_000_000_007_i64;
        let mut engineers = Vec::with_capacity(n as usize);
        for index in 0..n as usize {
            engineers.push((efficiency[index], speed[index]));
        }
        engineers.sort_by(|left, right| right.cmp(left));

        let mut result = 0_i64;
        let mut speed_sum = 0_i64;
        let mut heap = BinaryHeap::new();

        for (eff, spd) in engineers {
            if heap.len() == k as usize {
                if let Some(Reverse(value)) = heap.pop() {
                    speed_sum -= i64::from(value);
                }
            }
            speed_sum += i64::from(spd);
            heap.push(Reverse(spd));
            result = result.max(i64::from(eff) * speed_sum);
        }

        (result % modulo) as i32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::max_performance(6, vec![2, 10, 3, 1, 5, 8], vec![5, 4, 3, 9, 7, 2], 2),
            60
        );
        assert_eq!(
            Solution::max_performance(6, vec![2, 10, 3, 1, 5, 8], vec![5, 4, 3, 9, 7, 2], 3),
            68
        );
        assert_eq!(
            Solution::max_performance(6, vec![2, 10, 3, 1, 5, 8], vec![5, 4, 3, 9, 7, 2], 4),
            72
        );
    }
}
