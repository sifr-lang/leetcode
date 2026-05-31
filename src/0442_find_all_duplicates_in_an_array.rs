struct Solution;

impl Solution {
    pub fn find_duplicates(mut nums: Vec<i32>) -> Vec<i32> {
        let mut res = Vec::new();

        for i in 0..nums.len() {
            let num = nums[i].abs();
            let index = (num - 1) as usize;
            if nums[index] < 0 {
                res.push(num);
            }
            nums[index] = -nums[index];
        }

        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::find_duplicates(vec![4, 3, 2, 7, 8, 2, 3, 1]),
            vec![2, 3]
        );
        assert_eq!(Solution::find_duplicates(vec![1, 1, 2]), vec![1]);
        assert_eq!(Solution::find_duplicates(vec![1]), Vec::<i32>::new());
    }
}
