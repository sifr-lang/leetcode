struct Solution;

impl Solution {
    pub fn can_complete_circuit(gas: Vec<i32>, cost: Vec<i32>) -> i32 {
        let mut total_tank = 0;
        let mut current_tank = 0;
        let mut start = 0;

        for i in 0..gas.len() {
            let diff = gas[i] - cost[i];
            total_tank += diff;
            current_tank += diff;
            if current_tank < 0 {
                start = i as i32 + 1;
                current_tank = 0;
            }
        }

        if total_tank >= 0 {
            start
        } else {
            -1
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::can_complete_circuit(vec![1, 2, 3, 4, 5], vec![3, 4, 5, 1, 2]),
            3
        );
        assert_eq!(
            Solution::can_complete_circuit(vec![2, 3, 4], vec![3, 4, 3]),
            -1
        );
        assert_eq!(
            Solution::can_complete_circuit(vec![5, 1, 2, 3, 4], vec![4, 4, 1, 5, 1]),
            4
        );
    }
}
