struct Solution;

impl Solution {
    pub fn best_closing_time(customers: String) -> i32 {
        let mut cur_penalty = 0;
        let mut res = 0;
        let min_penalty = 0;

        for (i, ele) in customers.chars().enumerate() {
            if ele == 'Y' {
                cur_penalty -= 1;
                if cur_penalty < min_penalty {
                    res = i as i32 + 1;
                    cur_penalty = min_penalty;
                }
            } else {
                cur_penalty += 1;
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
        assert_eq!(Solution::best_closing_time(String::from("YYNY")), 2);
        assert_eq!(Solution::best_closing_time(String::from("NNNNN")), 0);
    }
}
