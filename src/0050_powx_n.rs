struct Solution;

impl Solution {
    pub fn my_pow(x: f64, n: i32) -> f64 {
        fn helper(x: f64, n: i32) -> f64 {
            match (x, n) {
                (0.0, _) => 0.0,
                (_, 0) => 1.0,
                _ => {
                    let res = helper(x * x, n / 2);
                    if n % 2 == 0 {
                        res
                    } else {
                        x * res
                    }
                }
            }
        }

        let res = helper(x, n.abs());

        if n >= 0 {
            res
        } else {
            1.0 / res
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::my_pow(2.0, 10), 1024.0);
        assert_eq!(Solution::my_pow(2.0, -2), 0.25);
    }
}
