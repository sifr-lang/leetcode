pub struct MyQueue {
    append_stack: Vec<i32>,
    inverted_stack: Vec<i32>,
}

impl MyQueue {
    pub fn new() -> Self {
        Self {
            append_stack: Vec::new(),
            inverted_stack: Vec::new(),
        }
    }

    pub fn push(&mut self, x: i32) {
        self.append_stack.push(x);
    }

    pub fn pop(&mut self) -> i32 {
        self.move_items();
        self.inverted_stack.pop().unwrap_or_default()
    }

    pub fn peek(&mut self) -> i32 {
        self.move_items();
        *self.inverted_stack.last().unwrap_or(&0)
    }

    pub fn empty(&self) -> bool {
        self.append_stack.is_empty() && self.inverted_stack.is_empty()
    }

    fn move_items(&mut self) {
        if self.inverted_stack.is_empty() {
            while let Some(value) = self.append_stack.pop() {
                self.inverted_stack.push(value);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut obj = MyQueue::new();
        obj.push(1);
        obj.push(2);
        assert_eq!(obj.peek(), 1);
        assert_eq!(obj.pop(), 1);
        assert_eq!(obj.empty(), false);
    }
}
