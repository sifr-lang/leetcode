pub fn maximal_square(matrix: Vec<Vec<String>>) -> i32 {
    if matrix.is_empty() || matrix[0].is_empty() {
        return 0;
    }

    let rows = matrix.len();
    let cols = matrix[0].len();
    let mut prev = vec![0; cols + 1];
    let mut best = 0;

    for r in (0..rows).rev() {
        let mut curr = vec![0; cols + 1];
        for c in (0..cols).rev() {
            if matrix[r][c] == "1" {
                curr[c] = 1 + prev[c].min(curr[c + 1]).min(prev[c + 1]);
                best = best.max(curr[c]);
            }
        }
        prev = curr;
    }

    best * best
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            maximal_square(vec![
                vec![
                    "1".to_string(),
                    "0".to_string(),
                    "1".to_string(),
                    "0".to_string(),
                    "0".to_string()
                ],
                vec![
                    "1".to_string(),
                    "0".to_string(),
                    "1".to_string(),
                    "1".to_string(),
                    "1".to_string()
                ],
                vec![
                    "1".to_string(),
                    "1".to_string(),
                    "1".to_string(),
                    "1".to_string(),
                    "1".to_string()
                ],
                vec![
                    "1".to_string(),
                    "0".to_string(),
                    "0".to_string(),
                    "1".to_string(),
                    "0".to_string()
                ]
            ]),
            4
        );
        assert_eq!(
            maximal_square(vec![
                vec!["0".to_string(), "1".to_string()],
                vec!["1".to_string(), "0".to_string()]
            ]),
            1
        );
        assert_eq!(maximal_square(vec![vec!["0".to_string()]]), 0);
    }
}
