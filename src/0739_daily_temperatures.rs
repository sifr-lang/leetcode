struct Solution;

impl Solution {
    pub fn daily_temperatures(temperatures: Vec<i32>) -> Vec<i32> {
        let mut res = vec![0; temperatures.len()];
        let mut stack: Vec<(i32, usize)> = vec![]; // (temp, index)

        for (i, val) in temperatures.iter().enumerate() {
            while !stack.is_empty() && *val > stack.last().unwrap().0 {
                let (_, stack_index) = stack.pop().unwrap();
                res[stack_index] = (i - stack_index) as i32;
            }

            stack.push((*val, i));
        }
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::daily_temperatures(vec![73, 74, 75, 71, 69, 72, 76, 73]),
            vec![1, 1, 4, 2, 1, 1, 0, 0]
        );
    }
}
