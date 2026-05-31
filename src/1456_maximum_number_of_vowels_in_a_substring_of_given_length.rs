struct Solution;

impl Solution {
    pub fn max_vowels(s: String, k: i32) -> i32 {
        fn is_vowel(ch: u8) -> bool {
            matches!(ch, b'a' | b'e' | b'i' | b'o' | b'u')
        }
        let bytes = s.as_bytes();
        let k = k as usize;
        let mut count = bytes.iter().take(k).filter(|ch| is_vowel(**ch)).count() as i32;
        let mut best = count;
        for i in k..bytes.len() {
            if is_vowel(bytes[i]) {
                count += 1;
            }
            if is_vowel(bytes[i - k]) {
                count -= 1;
            }
            best = best.max(count);
        }
        best
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(Solution::max_vowels("abciiidef".to_string(), 3), 3);
        assert_eq!(Solution::max_vowels("aeiou".to_string(), 2), 2);
    }
}
