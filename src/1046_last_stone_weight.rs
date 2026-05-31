struct Solution;

impl Solution {
    pub fn last_stone_weight(stones: Vec<i32>) -> i32 {
        let mut stones_heap = std::collections::BinaryHeap::new();
        for stone in stones {
            stones_heap.push(stone);
        }

        while stones_heap.len() > 1 {
            let first = stones_heap.pop().unwrap();
            let second = stones_heap.pop().unwrap();
            stones_heap.push(first - second);
        }

        match stones_heap.peek() {
            Some(val) => *val,
            None => 0,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::last_stone_weight(vec![2, 7, 4, 1, 8, 1]), 1);
        assert_eq!(Solution::last_stone_weight(vec![1]), 1);
    }
}
