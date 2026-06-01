struct Solution;

impl Solution {
    pub fn check_inclusion(s1: String, s2: String) -> bool {
        if s1.len() > s2.len() {
            return false;
        }

        let s1_bytes = s1.as_bytes();
        let s2_bytes = s2.as_bytes();

        let (mut s1_cnt, mut s2_cnt) = ([0; 26], [0; 26]);
        for i in 0..s1_bytes.len() {
            s1_cnt[(s1_bytes[i] - b'a') as usize] += 1;
            s2_cnt[(s2_bytes[i] - b'a') as usize] += 1;
        }

        let mut matches = 0;
        for i in 0..26 {
            matches = if s1_cnt[i] == s2_cnt[i] {
                matches + 1
            } else {
                matches
            };
        }

        let mut l = 0;
        for r in s1_bytes.len()..s2_bytes.len() {
            if matches == 26 {
                return true;
            }

            let mut index = (s2_bytes[r] - b'a') as usize;
            s2_cnt[index] += 1;
            if s1_cnt[index] == s2_cnt[index] {
                matches += 1;
            } else if s1_cnt[index] + 1 == s2_cnt[index] {
                matches -= 1;
            }

            index = (s2_bytes[l] - b'a') as usize;
            s2_cnt[index] -= 1;
            if s1_cnt[index] == s2_cnt[index] {
                matches += 1;
            } else if s1_cnt[index] - 1 == s2_cnt[index] {
                matches -= 1;
            }

            l += 1;
        }

        matches == 26
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::check_inclusion("ab".to_string(), "eidbaooo".to_string()),
            true
        );
        assert_eq!(
            Solution::check_inclusion("ab".to_string(), "eidboaoo".to_string()),
            false
        );
    }
}
