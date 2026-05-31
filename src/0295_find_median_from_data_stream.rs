use std::cmp::Reverse;
use std::collections::BinaryHeap;

struct MedianFinder {
    small: BinaryHeap<i32>,
    large: BinaryHeap<Reverse<i32>>,
}

impl MedianFinder {
    fn new() -> Self {
        Self {
            small: BinaryHeap::new(),
            large: BinaryHeap::new(),
        }
    }

    fn add_num(&mut self, num: i32) {
        if self.large.peek().is_some_and(|Reverse(value)| num > *value) {
            self.large.push(Reverse(num));
        } else {
            self.small.push(num);
        }

        if self.small.len() > self.large.len() + 1 {
            if let Some(value) = self.small.pop() {
                self.large.push(Reverse(value));
            }
        }
        if self.large.len() > self.small.len() + 1 {
            if let Some(Reverse(value)) = self.large.pop() {
                self.small.push(value);
            }
        }
    }

    fn find_median(&self) -> f64 {
        if self.small.len() > self.large.len() {
            return self.small.peek().copied().unwrap_or(0) as f64;
        }
        if self.large.len() > self.small.len() {
            return self
                .large
                .peek()
                .map_or(0.0, |Reverse(value)| f64::from(*value));
        }
        let left = self.small.peek().copied().unwrap_or(0);
        let right = self.large.peek().map_or(0, |Reverse(value)| *value);
        f64::from(left + right) / 2.0
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut obj = MedianFinder::new();
        obj.add_num(1);
        obj.add_num(2);
        assert_eq!(obj.find_median(), 1.5);
        obj.add_num(3);
        assert_eq!(obj.find_median(), 2.0);
    }
}
