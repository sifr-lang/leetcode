struct Solution;

impl Solution {
    fn makesquare_backtrack(
        i: usize,
        matchsticks: &[i32],
        sides: &mut [i32; 4],
        length: i32,
    ) -> bool {
        if i == matchsticks.len() {
            return true;
        }

        for j in 0..4 {
            if sides[j] + matchsticks[i] <= length {
                sides[j] += matchsticks[i];
                if Self::makesquare_backtrack(i + 1, matchsticks, sides, length) {
                    return true;
                }
                sides[j] -= matchsticks[i];
            }
        }
        false
    }

    pub fn makesquare(mut matchsticks: Vec<i32>) -> bool {
        let total: i32 = matchsticks.iter().sum();
        let length = total / 4;
        let mut sides = [0; 4];

        if total as f64 / 4.0 != f64::from(length) {
            return false;
        }

        matchsticks.sort_by(|a, b| b.cmp(a));
        Self::makesquare_backtrack(0, &matchsticks, &mut sides, length)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::makesquare(vec![1, 1, 2, 2, 2]), true);
        assert_eq!(Solution::makesquare(vec![3, 3, 3, 3, 4]), false);
    }
}
