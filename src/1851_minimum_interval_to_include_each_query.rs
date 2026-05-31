struct Solution;

use std::cmp::Reverse;
use std::collections::{BinaryHeap, HashMap};

impl Solution {
    pub fn min_interval(mut intervals: Vec<Vec<i32>>, queries: Vec<i32>) -> Vec<i32> {
        intervals.sort();
        let mut heap: BinaryHeap<Reverse<(i32, i32)>> = BinaryHeap::new();
        let mut result_by_query = HashMap::new();
        let mut index = 0;

        let mut sorted_queries = queries.clone();
        sorted_queries.sort();
        for query in sorted_queries {
            while index < intervals.len() && intervals[index][0] <= query {
                let left = intervals[index][0];
                let right = intervals[index][1];
                heap.push(Reverse((right - left + 1, right)));
                index += 1;
            }

            while heap
                .peek()
                .is_some_and(|Reverse((_, right))| *right < query)
            {
                heap.pop();
            }
            let answer = heap.peek().map_or(-1, |Reverse((size, _))| *size);
            result_by_query.insert(query, answer);
        }

        queries
            .iter()
            .map(|query| *result_by_query.get(query).unwrap_or(&-1))
            .collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::min_interval(
                vec![vec![1, 4], vec![2, 4], vec![3, 6], vec![4, 4]],
                vec![2, 3, 4, 5]
            ),
            vec![3, 3, 1, 4]
        );
        assert_eq!(
            Solution::min_interval(
                vec![vec![2, 3], vec![2, 5], vec![1, 8], vec![20, 25]],
                vec![2, 19, 5, 22]
            ),
            vec![2, -1, 4, 6]
        );
    }
}
