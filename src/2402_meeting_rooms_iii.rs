use std::cmp::Reverse;
use std::collections::BinaryHeap;

struct Solution;

impl Solution {
    pub fn most_booked(n: i32, mut meetings: Vec<Vec<i32>>) -> i32 {
        meetings.sort();

        let mut available = BinaryHeap::new();
        for i in 0..n {
            available.push(Reverse(i));
        }
        let mut used: BinaryHeap<Reverse<(i64, i32)>> = BinaryHeap::new();
        let mut count = vec![0; n as usize];

        for meeting in meetings {
            let start = i64::from(meeting[0]);
            let mut end = i64::from(meeting[1]);
            while let Some(Reverse((end_time, room))) = used.peek().copied() {
                if start < end_time {
                    break;
                }
                used.pop();
                available.push(Reverse(room));
            }

            if available.is_empty() {
                let Reverse((end_time, room)) = used.pop().unwrap();
                end = end_time + (end - start);
                available.push(Reverse(room));
            }

            let Reverse(room) = available.pop().unwrap();
            used.push(Reverse((end, room)));
            count[room as usize] += 1;
        }

        let mut best_room = 0usize;
        for room in 1..count.len() {
            if count[room] > count[best_room] {
                best_room = room;
            }
        }
        best_room as i32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::most_booked(2, vec![vec![0, 10], vec![1, 5], vec![2, 7], vec![3, 4]]),
            0
        );
        assert_eq!(
            Solution::most_booked(
                3,
                vec![vec![1, 20], vec![2, 10], vec![3, 5], vec![4, 9], vec![6, 8]]
            ),
            1
        );
    }
}
