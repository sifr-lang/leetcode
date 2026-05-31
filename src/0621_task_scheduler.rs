struct Solution;

use std::collections::{BinaryHeap, HashMap, VecDeque};

impl Solution {
    pub fn least_interval(tasks: Vec<char>, n: i32) -> i32 {
        let mut count = HashMap::new();
        let mut max_heap = BinaryHeap::new();
        for task in tasks {
            let count = count.entry(task).or_insert(0);
            *count += 1;
        }
        for (key, val) in count.iter() {
            max_heap.push(*val);
        }
        let mut time = 0;
        let mut deque: VecDeque<(i32, i32)> = VecDeque::new();
        while deque.len() > 0 || max_heap.len() > 0 {
            time += 1;

            if max_heap.len() == 0 {
                time = deque[0].1;
            } else {
                let cnt = max_heap.pop().unwrap() - 1;
                if cnt != 0 {
                    deque.push_back((cnt, time + n));
                }
            }
            if deque.len() > 0 && deque[0].1 == time {
                max_heap.push(deque.pop_front().unwrap().0);
            }
        }
        time
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::least_interval(vec!['A', 'A', 'A', 'B', 'B', 'B'], 2),
            8
        );
        assert_eq!(
            Solution::least_interval(vec!['A', 'C', 'A', 'B', 'D', 'B'], 1),
            6
        );
        assert_eq!(
            Solution::least_interval(vec!['A', 'A', 'A', 'B', 'B', 'B'], 3),
            10
        );
    }
}
