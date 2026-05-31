use std::collections::HashMap;

struct Solution;

impl Solution {
    pub fn find_least_num_of_unique_ints(arr: Vec<i32>, mut k: i32) -> i32 {
        let mut freq = HashMap::new();
        for n in &arr {
            *freq.entry(*n).or_insert(0usize) += 1;
        }

        let mut freq_list = vec![0i32; arr.len() + 1];
        for f in freq.values() {
            freq_list[*f] += 1;
        }

        let mut res = freq.len() as i32;
        for (f, remove) in freq_list.iter().enumerate().skip(1) {
            let f = f as i32;
            if k >= f * remove {
                k -= f * remove;
                res -= remove;
            } else {
                res -= k / f;
                break;
            }
        }

        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn main_asserts() {
        assert_eq!(Solution::find_least_num_of_unique_ints(vec![5, 5, 4], 1), 1);
        assert_eq!(
            Solution::find_least_num_of_unique_ints(vec![4, 3, 1, 1, 3, 3, 2], 3),
            2
        );
    }
}
