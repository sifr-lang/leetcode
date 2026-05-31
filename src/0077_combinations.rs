struct Solution;

impl Solution {
    fn combine_helper(start: i32, n: i32, k: usize, comb: &mut Vec<i32>, res: &mut Vec<Vec<i32>>) {
        if comb.len() == k {
            res.push(comb.clone());
            return;
        }

        for i in start..=n {
            comb.push(i);
            Self::combine_helper(i + 1, n, k, comb, res);
            comb.pop();
        }
    }

    pub fn combine(n: i32, k: i32) -> Vec<Vec<i32>> {
        let mut res = Vec::new();
        let mut comb = Vec::new();
        Self::combine_helper(1, n, k as usize, &mut comb, &mut res);
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::combine(4, 2),
            vec![
                vec![1, 2],
                vec![1, 3],
                vec![1, 4],
                vec![2, 3],
                vec![2, 4],
                vec![3, 4]
            ]
        );
    }
}
