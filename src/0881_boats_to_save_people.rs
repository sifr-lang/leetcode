struct Solution;

impl Solution {
    pub fn num_rescue_boats(mut people: Vec<i32>, limit: i32) -> i32 {
        people.sort();
        let mut left = 0usize;
        let mut right = people.len() as i32 - 1;
        let mut boats = 0;
        while left as i32 <= right {
            if people[left] + people[right as usize] <= limit {
                left += 1;
            }
            right -= 1;
            boats += 1;
        }
        boats
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(Solution::num_rescue_boats(vec![1, 2], 3), 1);
        assert_eq!(Solution::num_rescue_boats(vec![3, 2, 2, 1], 3), 3);
    }
}
