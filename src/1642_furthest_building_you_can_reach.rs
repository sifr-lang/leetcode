use std::collections::BinaryHeap;

struct Solution;

impl Solution {
    pub fn furthest_building(heights: Vec<i32>, mut bricks: i32, mut ladders: i32) -> i32 {
        let mut heap = BinaryHeap::new();

        for i in 0..heights.len() - 1 {
            let diff = heights[i + 1] - heights[i];
            if diff <= 0 {
                continue;
            }

            bricks -= diff;
            heap.push(diff);

            if bricks < 0 {
                if ladders == 0 {
                    return i as i32;
                }
                ladders -= 1;
                bricks += heap.pop().unwrap();
            }
        }

        (heights.len() - 1) as i32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::furthest_building(vec![4, 2, 7, 6, 9, 14, 12], 5, 1),
            4
        );
        assert_eq!(
            Solution::furthest_building(vec![4, 12, 2, 7, 3, 18, 20, 3, 19], 10, 2),
            7
        );
        assert_eq!(Solution::furthest_building(vec![14, 3, 19, 3], 17, 0), 3);
    }
}
