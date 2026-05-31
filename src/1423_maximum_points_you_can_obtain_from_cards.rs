struct Solution;

impl Solution {
    pub fn max_score(card_points: Vec<i32>, k: i32) -> i32 {
        let k = k as usize;
        let n = card_points.len();
        let mut score: i32 = card_points[..k].iter().sum();
        let mut max_score = score;

        for i in 1..=k {
            score += card_points[n - i] - card_points[k - i];
            max_score = max_score.max(score);
        }

        max_score
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::max_score(vec![1, 2, 3, 4, 5, 6, 1], 3), 12);
    }
}
