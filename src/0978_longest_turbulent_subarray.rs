struct Solution;

impl Solution {
    pub fn max_turbulence_size(arr: Vec<i32>) -> i32 {
        let mut l = 0;
        let mut r = 1;
        let mut res = 1;
        let mut prev = "";

        while r < arr.len() {
            if arr[r - 1] > arr[r] && prev != ">" {
                res = res.max((r - l + 1) as i32);
                r += 1;
                prev = ">";
            } else if arr[r - 1] < arr[r] && prev != "<" {
                res = res.max((r - l + 1) as i32);
                r += 1;
                prev = "<";
            } else {
                if arr[r] == arr[r - 1] {
                    r += 1;
                }
                l = r - 1;
                prev = "";
            }
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
            Solution::max_turbulence_size(vec![9, 4, 2, 10, 7, 8, 8, 1, 9]),
            5
        );
        assert_eq!(Solution::max_turbulence_size(vec![100]), 1);
    }
}
