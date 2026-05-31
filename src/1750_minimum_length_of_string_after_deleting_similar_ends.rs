struct Solution;

impl Solution {
    pub fn minimum_length(s: String) -> i32 {
        let s = s.as_bytes();
        let mut l = 0i32;
        let mut r = s.len() as i32 - 1;

        while l < r && s[l as usize] == s[r as usize] {
            let tmp = s[l as usize];
            while l <= r && s[l as usize] == tmp {
                l += 1;
            }
            while l <= r && s[r as usize] == tmp {
                r -= 1;
            }
        }

        r - l + 1
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn main_asserts() {
        assert_eq!(Solution::minimum_length(String::from("ca")), 2);
        assert_eq!(Solution::minimum_length(String::from("cabaabac")), 0);
    }
}
