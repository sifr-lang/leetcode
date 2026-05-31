use std::collections::VecDeque;

struct MyCircularQueue {
    values: VecDeque<i32>,
    capacity: usize,
}

impl MyCircularQueue {
    fn new(k: i32) -> Self {
        Self {
            values: VecDeque::new(),
            capacity: k as usize,
        }
    }

    fn en_queue(&mut self, value: i32) -> bool {
        if self.is_full() {
            return false;
        }
        self.values.push_back(value);
        true
    }

    fn de_queue(&mut self) -> bool {
        if self.is_empty() {
            return false;
        }
        self.values.pop_front();
        true
    }

    fn front(&self) -> i32 {
        self.values.front().copied().unwrap_or(-1)
    }

    fn rear(&self) -> i32 {
        self.values.back().copied().unwrap_or(-1)
    }

    fn is_empty(&self) -> bool {
        self.values.is_empty()
    }

    fn is_full(&self) -> bool {
        self.values.len() == self.capacity
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut obj = MyCircularQueue::new(3);
        assert_eq!(obj.en_queue(1), true);
        assert_eq!(obj.en_queue(2), true);
        assert_eq!(obj.en_queue(3), true);
        assert_eq!(obj.en_queue(4), false);
        assert_eq!(obj.rear(), 3);
        assert_eq!(obj.is_full(), true);
        assert_eq!(obj.de_queue(), true);
        assert_eq!(obj.en_queue(4), true);
        assert_eq!(obj.rear(), 4);
    }
}
