use std::collections::VecDeque;

struct MyStack {
    q: VecDeque<i32>,
}

impl MyStack {
    fn new() -> Self {
        Self { q: VecDeque::new() }
    }

    fn push(&mut self, x: i32) {
        self.q.push_back(x);
    }

    fn pop(&mut self) -> i32 {
        for i in 0..self.q.len() - 1 {
            let temp = self.q.pop_front().unwrap();
            self.q.push_back(temp);
        }
        self.q.pop_front().unwrap()
    }

    fn top(&self) -> i32 {
        self.q[self.q.len() - 1]
    }

    fn empty(&self) -> bool {
        self.q.is_empty()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        let mut obj = MyStack::new();
        obj.push(1);
        obj.push(2);
        assert_eq!(obj.top(), 2);
        assert_eq!(obj.pop(), 2);
        assert_eq!(obj.empty(), false);
    }
}
