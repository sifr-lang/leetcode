struct Solution;

impl Solution {
    fn backtrack(
        candidates: &[i32],
        cur: &mut Vec<i32>,
        pos: usize,
        target: i32,
        res: &mut Vec<Vec<i32>>,
    ) {
        if target == 0 {
            res.push(cur.clone());
            return;
        }
        if target <= 0 {
            return;
        }

        let mut prev = -1;
        for i in pos..candidates.len() {
            if candidates[i] == prev {
                continue;
            }
            cur.push(candidates[i]);
            Self::backtrack(candidates, cur, i + 1, target - candidates[i], res);
            cur.pop();
            prev = candidates[i];
        }
    }

    pub fn combination_sum2(mut candidates: Vec<i32>, target: i32) -> Vec<Vec<i32>> {
        candidates.sort();
        let mut res = Vec::new();
        let mut cur = Vec::new();
        Self::backtrack(&candidates, &mut cur, 0, target, &mut res);
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::combination_sum2(vec![10, 1, 2, 7, 6, 1, 5], 8),
            vec![vec![1, 1, 6], vec![1, 2, 5], vec![1, 7], vec![2, 6]]
        );
    }
}
