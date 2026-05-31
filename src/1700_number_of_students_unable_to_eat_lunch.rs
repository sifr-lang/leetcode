use std::collections::VecDeque;

struct Solution;

impl Solution {
    pub fn count_students(students: Vec<i32>, sandwiches: Vec<i32>) -> i32 {
        let mut students: VecDeque<i32> = students.into();
        let mut sandwiches: VecDeque<i32> = sandwiches.into();
        let mut num_of_students_back_in_line = 0usize;

        while num_of_students_back_in_line != students.len() {
            let curr_student = students.pop_front().unwrap();
            if curr_student == *sandwiches.front().unwrap() {
                sandwiches.pop_front();
                num_of_students_back_in_line = 0;
            } else {
                students.push_back(curr_student);
                num_of_students_back_in_line += 1;
            }
        }

        students.len() as i32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::count_students(vec![1, 1, 0, 0], vec![0, 1, 0, 1]),
            0
        );
    }
}
