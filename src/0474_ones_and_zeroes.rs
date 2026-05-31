use std::collections::HashMap;

pub fn find_max_form(strs: Vec<String>, m: i32, n: i32) -> i32 {
    let mut dp: HashMap<(i32, i32), i32> = HashMap::new();

    for s in strs {
        let m_cnt = s.bytes().filter(|&ch| ch == b'0').count() as i32;
        let n_cnt = s.bytes().filter(|&ch| ch == b'1').count() as i32;
        for cur_m in (m_cnt..=m).rev() {
            for cur_n in (n_cnt..=n).rev() {
                let take = 1 + *dp.get(&(cur_m - m_cnt, cur_n - n_cnt)).unwrap_or(&0);
                let skip = *dp.get(&(cur_m, cur_n)).unwrap_or(&0);
                dp.insert((cur_m, cur_n), take.max(skip));
            }
        }
    }

    *dp.get(&(m, n)).unwrap_or(&0)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            find_max_form(
                vec![
                    "10".to_string(),
                    "0001".to_string(),
                    "111001".to_string(),
                    "1".to_string(),
                    "0".to_string()
                ],
                5,
                3
            ),
            4
        );
        assert_eq!(
            find_max_form(
                vec!["10".to_string(), "0".to_string(), "1".to_string()],
                1,
                1
            ),
            2
        );
    }
}
