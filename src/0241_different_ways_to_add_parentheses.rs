struct Solution;

impl Solution {
    pub fn diff_ways_to_compute(expression: String) -> Vec<i32> {
        fn compute(expr: &str) -> Vec<i32> {
            let mut res = Vec::new();

            for (i, op) in expr.char_indices() {
                if matches!(op, '+' | '-' | '*') {
                    for left in compute(&expr[..i]) {
                        for right in compute(&expr[i + op.len_utf8()..]) {
                            let value = match op {
                                '+' => left + right,
                                '-' => left - right,
                                '*' => left * right,
                                _ => unreachable!(),
                            };
                            res.push(value);
                        }
                    }
                }
            }

            if res.is_empty() {
                res.push(expr.parse::<i32>().unwrap());
            }

            res
        }

        compute(&expression)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::diff_ways_to_compute(String::from("2-1-1")),
            vec![2, 0]
        );
    }
}
