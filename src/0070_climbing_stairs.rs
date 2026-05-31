struct Solution;

impl Solution {
    pub fn climb_stairs(n: i32) -> i32 {
        std::iter::successors(Some((0, 1)), |dp| Some((dp.1, dp.0 + dp.1)))
            .take((n + 1) as usize)
            .last()
            .unwrap()
            .1
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::climb_stairs(1), 1);
        assert_eq!(Solution::climb_stairs(2), 2);
        assert_eq!(Solution::climb_stairs(3), 3);
        assert_eq!(Solution::climb_stairs(5), 8);
        assert_eq!(Solution::climb_stairs(10), 89);
    }
}
