struct Solution;

impl Solution {
    pub fn get_sum(a: i32, b: i32) -> i32 {
        fn recurse(a: i32, b: i32) -> i32 {
            if (a & b) << 1 == 0 {
                return a ^ b;
            }

            recurse(a ^ b, (a & b) << 1)
        }

        recurse(a, b)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::get_sum(1, 2), 3);
        assert_eq!(Solution::get_sum(2, 3), 5);
    }
}
