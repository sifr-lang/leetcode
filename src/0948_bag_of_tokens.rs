struct Solution;

impl Solution {
    pub fn bag_of_tokens_score(mut tokens: Vec<i32>, mut power: i32) -> i32 {
        let mut res = 0;
        let mut score = 0;
        tokens.sort();

        let mut l = 0usize;
        let mut r = tokens.len();
        while l < r {
            if power >= tokens[l] {
                power -= tokens[l];
                l += 1;
                score += 1;
                res = res.max(score);
            } else if score > 0 {
                r -= 1;
                power += tokens[r];
                score -= 1;
            } else {
                break;
            }
        }
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::bag_of_tokens_score(vec![100], 50), 0);
        assert_eq!(Solution::bag_of_tokens_score(vec![200, 100], 150), 1);
    }
}
