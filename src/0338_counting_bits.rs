struct Solution;

impl Solution {
    pub fn count_bits(n: i32) -> Vec<i32> {
        let mut ans = Vec::new();

        for i in 0..=n {
            ans.push(set_bits(i));
        }

        ans
    }
}

pub fn set_bits(mut n: i32) -> i32 {
    let mut count = 0;

    while n > 0 {
        n = n & (n - 1);
        count += 1;
    }

    count
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::count_bits(2), vec![0, 1, 1]);
        assert_eq!(Solution::count_bits(5), vec![0, 1, 1, 2, 1, 2]);
    }
}
