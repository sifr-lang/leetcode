use std::cmp::Ordering;

struct Solution;

impl Solution {
    pub fn asteroid_collision(asteroids: Vec<i32>) -> Vec<i32> {
        let mut stack: Vec<i32> = vec![];

        for mut asteroid in asteroids {
            while !stack.is_empty() && asteroid < 0 && stack.last() > Some(&0) {
                let diff = asteroid + stack.last().unwrap();
                match diff.cmp(&0) {
                    Ordering::Less => {
                        stack.pop();
                    }
                    Ordering::Greater => asteroid = 0,
                    Ordering::Equal => {
                        asteroid = 0;
                        stack.pop();
                    }
                };
            }
            if asteroid != 0 {
                stack.push(asteroid);
            }
        }
        stack
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(Solution::asteroid_collision(vec![5, 10, -5]), vec![5, 10]);
        assert_eq!(Solution::asteroid_collision(vec![8, -8]), vec![]);
        assert_eq!(Solution::asteroid_collision(vec![10, 2, -5]), vec![10]);
    }
}
