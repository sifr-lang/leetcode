struct Solution;

impl Solution {
    fn backtrack(mut i: usize, result: &mut Vec<Vec<i32>>, nums: &Vec<i32>, subset: &mut Vec<i32>) {
        if i == nums.len() {
            result.push(subset.to_owned());
            return;
        }

        subset.push(nums[i]);
        Solution::backtrack(i + 1, result, nums, subset);
        subset.pop();

        while i + 1 < nums.len() && nums[i] == nums[i + 1] {
            i += 1;
        }
        Solution::backtrack(i + 1, result, nums, subset);
    }

    pub fn subsets_with_dup(nums: Vec<i32>) -> Vec<Vec<i32>> {
        let (mut nums, mut result) = (nums, Vec::new());
        result.reserve(1_usize << nums.len());
        nums.sort();

        let mut subset = Vec::with_capacity(nums.len());
        Solution::backtrack(0_usize, &mut result, &nums, &mut subset);
        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::subsets_with_dup(vec![1, 2, 2]),
            vec![
                vec![1, 2, 2],
                vec![1, 2],
                vec![1],
                vec![2, 2],
                vec![2],
                vec![]
            ]
        );
    }
}
