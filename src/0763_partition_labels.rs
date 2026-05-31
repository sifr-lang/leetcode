struct Solution;

use std::collections::HashMap;

impl Solution {
    pub fn partition_labels(s: String) -> Vec<i32> {
        let mut count = HashMap::new();
        let mut res = Vec::new();
        let mut i = 0;
        let length = s.len();
        let chars: Vec<char> = s.chars().collect();

        for (j, &c) in chars.iter().enumerate() {
            count.insert(c, j);
        }

        let mut cur_len = 0;
        let mut goal = 0;
        while i < length {
            let c = chars[i];
            goal = goal.max(count[&c]);
            cur_len += 1;

            if goal == i {
                res.push(cur_len);
                cur_len = 0;
            }
            i += 1;
        }
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::partition_labels("ababcbacadefegdehijhklij".to_string()),
            vec![9, 7, 8]
        );
    }
}
