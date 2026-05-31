struct Solution;

impl Solution {
    pub fn maximum_odd_binary_number(s: String) -> String {
        let mut s: Vec<char> = s.chars().collect();
        let mut left = 0usize;

        for i in 0..s.len() {
            if s[i] == '1' {
                s.swap(i, left);
                left += 1;
            }
        }
        let last = s.len() - 1;
        s.swap(left - 1, last);
        s.into_iter().collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::maximum_odd_binary_number(String::from("010")),
            String::from("001")
        );
        assert_eq!(
            Solution::maximum_odd_binary_number(String::from("0101")),
            String::from("1001")
        );
    }
}
