struct Solution;

impl Solution {
    pub fn min_flips(s: String) -> i32 {
        let n = s.len();
        let doubled = format!("{s}{s}");
        let bytes = doubled.as_bytes();
        let mut diff1 = 0;
        let mut diff2 = 0;
        let mut result = n as i32;
        for right in 0..bytes.len() {
            let expected1 = if right % 2 == 0 { b'0' } else { b'1' };
            let expected2 = if right % 2 == 0 { b'1' } else { b'0' };
            if bytes[right] != expected1 {
                diff1 += 1;
            }
            if bytes[right] != expected2 {
                diff2 += 1;
            }
            if right >= n {
                let left = right - n;
                let left_expected1 = if left % 2 == 0 { b'0' } else { b'1' };
                let left_expected2 = if left % 2 == 0 { b'1' } else { b'0' };
                if bytes[left] != left_expected1 {
                    diff1 -= 1;
                }
                if bytes[left] != left_expected2 {
                    diff2 -= 1;
                }
            }
            if right + 1 >= n {
                result = result.min(diff1.min(diff2));
            }
        }
        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(Solution::min_flips("111000".to_string()), 2);
        assert_eq!(Solution::min_flips("010".to_string()), 0);
        assert_eq!(Solution::min_flips("1110".to_string()), 1);
    }
}
