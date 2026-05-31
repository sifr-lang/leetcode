struct Solution;

impl Solution {
    pub fn permute(nums: Vec<i32>) -> Vec<Vec<i32>> {
        permute_python_order(nums)
    }
}

fn permute_python_order(mut nums: Vec<i32>) -> Vec<Vec<i32>> {
    if nums.len() == 1 {
        return vec![nums];
    }

    let mut res = Vec::new();
    for _ in 0..nums.len() {
        let n = nums.remove(0);
        let mut perms = permute_python_order(nums.clone());
        for perm in &mut perms {
            perm.push(n);
        }
        res.extend(perms);
        nums.push(n);
    }

    res
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::permute(vec![1, 2, 3]),
            vec![
                vec![3, 2, 1],
                vec![2, 3, 1],
                vec![1, 3, 2],
                vec![3, 1, 2],
                vec![2, 1, 3],
                vec![1, 2, 3]
            ]
        );
    }
}
