struct Solution;

impl Solution {
    pub fn reverse_bits(mut x: u32) -> u32 {
        (0..32).fold(0, |mut res, _| {
            res = (res << 1) | (x & 1);
            x >>= 1;
            res
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::reverse_bits(43261596), 964176192);
        assert_eq!(Solution::reverse_bits(4294967293), 3221225471);
    }
}
