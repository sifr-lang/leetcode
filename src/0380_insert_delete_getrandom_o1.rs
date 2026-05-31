use std::collections::HashMap;

pub struct RandomizedSet {
    mp: HashMap<i32, i32>,
    arr: Vec<i32>,
}

impl RandomizedSet {
    fn new() -> Self {
        RandomizedSet {
            mp: HashMap::new(),
            arr: Vec::new(),
        }
    }

    fn insert(&mut self, val: i32) -> bool {
        let res = !self.mp.contains_key(&val);
        if res {
            self.mp.insert(val, self.arr.len() as i32);
            self.arr.push(val);
        }
        res
    }
    fn remove(&mut self, val: i32) -> bool {
        let res = self.mp.contains_key(&val);
        if res {
            let idx = *self.mp.get(&val).unwrap();
            self.mp
                .entry(*self.arr.last().unwrap())
                .and_modify(|v| *v = idx);
            self.arr.swap_remove(idx as usize);
            self.mp.remove(&val);
        }
        res
    }
    fn get_random(&self) -> i32 {
        self.arr[0]
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut randomized_set = RandomizedSet::new();
        assert_eq!(randomized_set.insert(1), true);
        assert_eq!(randomized_set.remove(2), false);
        assert_eq!(randomized_set.insert(2), true);
        assert_eq!(randomized_set.get_random(), 1);
        assert_eq!(randomized_set.remove(1), true);
        assert_eq!(randomized_set.insert(2), false);
        assert_eq!(randomized_set.get_random(), 2);
    }
}
