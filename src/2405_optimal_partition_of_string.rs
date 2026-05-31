struct Solution;

impl Solution {
    pub fn partition_string(s: String) -> i32 {
        let mut count = 1;
        let mut seen = 0;

        for ch in s.bytes() {
            let mask = 1 << (ch - b'a');
            if seen & mask != 0 {
                count += 1;
                seen = 0;
            }
            seen |= mask;
        }

        count
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::partition_string(String::from("abacbc")), 3);
        assert_eq!(Solution::partition_string(String::from("ssssss")), 6);
    }
}
