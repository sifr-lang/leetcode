struct MyLinkedList {
    values: Vec<i32>,
}

impl MyLinkedList {
    fn new() -> Self {
        Self { values: Vec::new() }
    }

    fn get(&self, index: i32) -> i32 {
        if index < 0 || index as usize >= self.values.len() {
            return -1;
        }
        self.values[index as usize]
    }

    fn add_at_head(&mut self, val: i32) {
        self.values.insert(0, val);
    }

    fn add_at_tail(&mut self, val: i32) {
        self.values.push(val);
    }

    fn add_at_index(&mut self, index: i32, val: i32) {
        let index = index.max(0) as usize;
        if index > self.values.len() {
            return;
        }
        self.values.insert(index, val);
    }

    fn delete_at_index(&mut self, index: i32) {
        if index < 0 || index as usize >= self.values.len() {
            return;
        }
        self.values.remove(index as usize);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut obj = MyLinkedList::new();
        obj.add_at_head(1);
        obj.add_at_tail(3);
        obj.add_at_index(1, 2);
        assert_eq!(obj.get(1), 2);
        obj.delete_at_index(1);
        assert_eq!(obj.get(1), 3);
        obj.add_at_index(3, 4);
        assert_eq!(obj.get(3), -1);
        obj.add_at_index(-1, 5);
        assert_eq!(obj.get(0), 5);
        obj.delete_at_index(0);
        assert_eq!(obj.get(0), 1);
    }
}
