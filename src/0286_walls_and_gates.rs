struct Solution;

use std::collections::{HashSet, VecDeque};

impl Solution {
    fn add_rooms(
        r: i32,
        c: i32,
        rooms: &[Vec<i32>],
        visit: &mut HashSet<(i32, i32)>,
        q: &mut VecDeque<(i32, i32)>,
    ) {
        let rows = rooms.len() as i32;
        let cols = rooms[0].len() as i32;
        if r.min(c) < 0
            || r == rows
            || c == cols
            || visit.contains(&(r, c))
            || rooms[r as usize][c as usize] == -1
        {
            return;
        }
        visit.insert((r, c));
        q.push_back((r, c));
    }

    pub fn walls_and_gates(rooms: &mut Vec<Vec<i32>>) {
        let rows = rooms.len();
        let cols = rooms[0].len();
        let mut visit = HashSet::new();
        let mut q = VecDeque::new();

        for r in 0..rows {
            for c in 0..cols {
                if rooms[r][c] == 0 {
                    q.push_back((r as i32, c as i32));
                    visit.insert((r as i32, c as i32));
                }
            }
        }

        let mut dist = 0;
        while !q.is_empty() {
            let level_len = q.len();
            for _ in 0..level_len {
                let (r, c) = q.pop_front().unwrap();
                rooms[r as usize][c as usize] = dist;
                Self::add_rooms(r + 1, c, rooms, &mut visit, &mut q);
                Self::add_rooms(r - 1, c, rooms, &mut visit, &mut q);
                Self::add_rooms(r, c + 1, rooms, &mut visit, &mut q);
                Self::add_rooms(r, c - 1, rooms, &mut visit, &mut q);
            }
            dist += 1;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut arg0 = vec![
            vec![2147483647, -1, 0, 2147483647],
            vec![2147483647, 2147483647, 2147483647, -1],
            vec![2147483647, -1, 2147483647, -1],
            vec![0, -1, 2147483647, 2147483647],
        ];
        Solution::walls_and_gates(&mut arg0);
        assert_eq!(
            arg0,
            vec![
                vec![3, -1, 0, 1],
                vec![2, 2, 1, -1],
                vec![1, -1, 2, -1],
                vec![0, -1, 3, 4]
            ]
        );
        let mut arg0 = vec![vec![-1]];
        Solution::walls_and_gates(&mut arg0);
        assert_eq!(arg0, vec![vec![-1]]);
    }
}
