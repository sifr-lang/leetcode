struct MyStack {
    data: Vec<i32>,
}

impl MyStack {
    fn new() -> Self {
        Self { data: Vec::new() }
    }

    fn push(&mut self, x: i32) {
        self.data.push(x);
    }

    fn pop(&mut self) -> i32 {
        self.data.pop().unwrap_or(0)
    }

    fn top(&self) -> i32 {
        self.data.last().copied().unwrap_or(0)
    }

    fn empty(&self) -> bool {
        self.data.is_empty()
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
