const BAD_VERSION: i32 = 4;

struct Solution;

fn is_bad_version(version: i32) -> bool {
    version >= BAD_VERSION
}

impl Solution {
    pub fn first_bad_version(n: i32) -> i32 {
        let mut left = 1;
        let mut right = n;

        while left < right {
            let version = (left + right) / 2;
            if is_bad_version(version) {
                right = version;
            } else {
                left = version + 1;
            }
        }

        left
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::first_bad_version(5), 4);
        assert_eq!(Solution::first_bad_version(4), 4);
    }
}
