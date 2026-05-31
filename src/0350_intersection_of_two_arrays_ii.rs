use std::collections::HashMap;

struct Solution;

impl Solution {
    pub fn intersect(nums1: Vec<i32>, nums2: Vec<i32>) -> Vec<i32> {
        let mut counter1 = HashMap::new();
        let mut counter2 = HashMap::new();
        let mut order = Vec::new();

        for num in nums1 {
            if !counter1.contains_key(&num) {
                order.push(num);
            }
            *counter1.entry(num).or_insert(0) += 1;
        }
        for num in nums2 {
            *counter2.entry(num).or_insert(0) += 1;
        }

        let mut intersection = Vec::new();
        for num in order {
            let freq = counter1[&num];
            let min_freq = freq.min(*counter2.get(&num).unwrap_or(&0));
            if min_freq > 0 {
                intersection.extend(std::iter::repeat(num).take(min_freq as usize));
            }
        }

        intersection
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::intersect(vec![1, 2, 2, 1], vec![2, 2]),
            vec![2, 2]
        );
        assert_eq!(
            Solution::intersect(vec![4, 9, 5], vec![9, 4, 9, 8, 4]),
            vec![4, 9]
        );
    }
}
