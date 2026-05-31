struct Solution;

use std::collections::HashMap;

impl Solution {
    // Time Complexity: O(n)
    // Space Complexity: O(1)
    // Boyer - Moore Algorithm
    pub fn majority_element(nums: Vec<i32>) -> i32 {
        let (mut res, mut count) = (0, 0);

        for n in nums {
            if count == 0 {
                res = n;
            }
            count += if n == res { 1 } else { -1 };
        }
        res
    }

    // Time Complexity: O(n)
    // Space Complexity: O(n)
    // Hashmap
    pub fn majority_element_2(nums: Vec<i32>) -> i32 {
        let mut count = HashMap::new();

        let (mut res, mut max_count) = (0, 0);

        for num in nums {
            *count.entry(num).or_insert(0) += 1;
            res = if *count.get(&num).unwrap() > max_count {
                num
            } else {
                res
            };
            max_count = i32::max(*count.get(&num).unwrap(), max_count);
        }
        res
    }

    // Time Complexity: O(nlogn)
    // Space Complexity: O(1)
    // Sorting
    pub fn majority_element_3(nums: Vec<i32>) -> i32 {
        // Since we are assured that there will be a majority element which occurs more than nums.len() / 2 times, majority element will be at nums.len() / 2 index
        let mut nums = nums;
        nums.sort();
        nums[nums.len() / 2]
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::majority_element(vec![3, 2, 3]), 3);
        assert_eq!(Solution::majority_element(vec![2, 2, 1, 1, 1, 2, 2]), 2);
        assert_eq!(Solution::majority_element(vec![1]), 1);
        assert_eq!(Solution::majority_element(vec![6, 5, 5]), 5);
    }
}
