use std::collections::{HashMap, VecDeque};

struct LRUCache {
    cap: usize,
    cache: HashMap<i32, i32>,
    order: VecDeque<i32>,
}

impl LRUCache {
    fn new(capacity: i32) -> Self {
        Self {
            cap: capacity as usize,
            cache: HashMap::new(),
            order: VecDeque::new(),
        }
    }

    fn get(&mut self, key: i32) -> i32 {
        let Some(value) = self.cache.get(&key).copied() else {
            return -1;
        };
        self.remove_key(key);
        self.order.push_back(key);
        value
    }

    fn put(&mut self, key: i32, value: i32) {
        if self.cache.contains_key(&key) {
            self.remove_key(key);
        }
        self.cache.insert(key, value);
        self.order.push_back(key);

        if self.cache.len() > self.cap {
            if let Some(lru) = self.order.pop_front() {
                self.cache.remove(&lru);
            }
        }
    }

    fn remove_key(&mut self, key: i32) {
        if let Some(index) = self.order.iter().position(|value| *value == key) {
            self.order.remove(index);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut obj = LRUCache::new(2);
        obj.put(1, 1);
        obj.put(2, 2);
        assert_eq!(obj.get(1), 1);
        obj.put(3, 3);
        assert_eq!(obj.get(2), -1);
        obj.put(4, 4);
        assert_eq!(obj.get(1), -1);
        assert_eq!(obj.get(3), 3);
        assert_eq!(obj.get(4), 4);
        let mut obj2 = LRUCache::new(1);
        obj2.put(8, -1);
        assert_eq!(obj2.get(8), -1);
        obj2.put(9, 9);
        assert_eq!(obj2.get(8), -1);
        assert_eq!(obj2.get(9), 9);
    }
}
