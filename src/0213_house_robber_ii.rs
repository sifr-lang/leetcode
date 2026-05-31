struct Solution;

impl Solution {
    pub fn rob(nums: Vec<i32>) -> i32 {
        let l = nums.len();
        return match l {
            0 => 0,
            1 => nums[0],
            _ => rob_house(&nums[1..]).max(rob_house(&nums[0..l - 1])),
        };
        fn rob_house(nums: &[i32]) -> i32 {
            nums.iter()
                .fold((0, 0), |loot, money| (loot.1, loot.1.max(loot.0 + money)))
                .1
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::rob(vec![2, 3, 2]), 3);
        assert_eq!(Solution::rob(vec![1, 2, 3, 1]), 4);
    }
}
