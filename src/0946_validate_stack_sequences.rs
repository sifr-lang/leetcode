struct Solution;

impl Solution {
    pub fn validate_stack_sequences(pushed: Vec<i32>, popped: Vec<i32>) -> bool {
        let mut stack = Vec::new();
        let mut index = 0usize;
        for value in pushed {
            stack.push(value);
            while !stack.is_empty()
                && index < popped.len()
                && *stack.last().unwrap() == popped[index]
            {
                stack.pop();
                index += 1;
            }
        }
        index == popped.len()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::validate_stack_sequences(vec![1, 2, 3, 4, 5], vec![4, 5, 3, 2, 1]),
            true
        );
        assert_eq!(
            Solution::validate_stack_sequences(vec![1, 2, 3, 4, 5], vec![4, 3, 5, 1, 2]),
            false
        );
    }
}
