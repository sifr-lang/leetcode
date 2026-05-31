struct Solution;

//  time compexity : O(n)
// space compexity : O(1)

impl Solution {
    pub fn min_cost_climbing_stairs(mut cost: Vec<i32>) -> i32 {
        for i in 2..cost.len() {
            cost[i] += cost[i - 1].min(cost[i - 2]);
        }

        let len = cost.len();

        cost[len - 1].min(cost[len - 2])
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::min_cost_climbing_stairs(vec![10, 15, 20]), 15);
    }
}
