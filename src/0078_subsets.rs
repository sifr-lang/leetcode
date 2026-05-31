struct Solution;

impl Solution {
    pub fn subsets(nums: Vec<i32>) -> Vec<Vec<i32>> {
        let mut res = Vec::new();
        let mut subset = Vec::new();
        dfs(0, &nums, &mut subset, &mut res);
        res
    }
}

fn dfs(index: usize, nums: &[i32], subset: &mut Vec<i32>, res: &mut Vec<Vec<i32>>) {
    if index >= nums.len() {
        res.push(subset.clone());
        return;
    }

    subset.push(nums[index]);
    dfs(index + 1, nums, subset, res);
    subset.pop();
    dfs(index + 1, nums, subset, res);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::subsets(vec![1, 2, 3]),
            vec![
                vec![1, 2, 3],
                vec![1, 2],
                vec![1, 3],
                vec![1],
                vec![2, 3],
                vec![2],
                vec![3],
                vec![]
            ]
        );
    }
}
