struct Solution;

impl Solution {
    pub fn length_of_lis(nums: Vec<i32>) -> i32 {
        let mut tails = vec![];

        for &num in &nums {
            match tails.binary_search(&num) {
                Ok(_) => {}
                Err(i) => {
                    if i == tails.len() {
                        tails.push(num);
                    } else {
                        tails[i] = num;
                    }
                }
            }
        }
        tails.len() as i32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::length_of_lis(vec![10, 9, 2, 5, 3, 7, 101, 18]), 4);
        assert_eq!(Solution::length_of_lis(vec![0, 1, 0, 3, 2, 3]), 4);
        assert_eq!(Solution::length_of_lis(vec![7, 7, 7, 7, 7, 7, 7]), 1);
        assert_eq!(Solution::length_of_lis(vec![1]), 1);
    }
}
