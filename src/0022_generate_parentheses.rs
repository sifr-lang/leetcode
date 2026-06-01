struct Solution;

impl Solution {
    pub fn generate_parenthesis(n: i32) -> Vec<String> {
        let mut stack = String::new();
        let mut res: Vec<String> = Vec::new();

        fn backtrack(stack: &mut String, res: &mut Vec<String>, open: i32, closed: i32, n: i32) {
            if open == n && closed == n {
                res.push(stack.clone());
                return;
            }

            if open < n {
                stack.push('(');
                backtrack(stack, res, open + 1, closed, n);
                stack.pop();
            }
            if closed < open {
                stack.push(')');
                backtrack(stack, res, open, closed + 1, n);
                stack.pop();
            }
        }

        backtrack(&mut stack, &mut res, 0, 0, n);
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::generate_parenthesis(3),
            vec![
                "((()))".to_string(),
                "(()())".to_string(),
                "(())()".to_string(),
                "()(())".to_string(),
                "()()()".to_string()
            ]
        );
    }
}
