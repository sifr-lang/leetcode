use std::{cmp::Reverse, collections::BinaryHeap};

struct KthLargest {
    min_heap: BinaryHeap<Reverse<i32>>,
    size: usize,
}

impl KthLargest {
    fn new(k: i32, nums: Vec<i32>) -> Self {
        let mut kth_largest = KthLargest {
            min_heap: BinaryHeap::new(),
            size: k as usize,
        };
        for n in nums {
            kth_largest.add(n);
        }
        kth_largest
    }

    fn add(&mut self, val: i32) -> i32 {
        self.min_heap.push(Reverse(val));
        if self.min_heap.len() > self.size {
            self.min_heap.pop();
        }

        match self.min_heap.peek() {
            Some(Reverse(min_val)) => *min_val,
            _ => -1,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut obj = KthLargest::new(3, vec![4, 5, 8, 2]);
        assert_eq!(obj.add(3), 4);
        assert_eq!(obj.add(5), 5);
        assert_eq!(obj.add(10), 5);
        assert_eq!(obj.add(9), 8);
        assert_eq!(obj.add(4), 8);
    }
}
