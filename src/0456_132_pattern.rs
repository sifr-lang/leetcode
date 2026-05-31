struct Solution;

impl Solution {
    pub fn find132pattern(nums: Vec<i32>) -> bool {
        let mut stack: Vec<(i32, i32)> = vec![]; // (num, min_left)
        let mut current_min = nums[0];

        for n in nums.iter().skip(1) {
            while !stack.is_empty() && *n >= stack.last().unwrap().0 {
                stack.pop();
            }
            if !stack.is_empty() && *n > stack.last().unwrap().1 {
                return true;
            }

            stack.push((*n, current_min));
            current_min = current_min.min(*n);
        }

        false
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(Solution::find132pattern(vec![1, 2, 3, 4]), false);
        assert_eq!(Solution::find132pattern(vec![3, 1, 4, 2]), true);
    }
}
