struct StockSpanner {
    stack: Vec<(i32, i32)>, // (price, span)
}

impl StockSpanner {
    fn new() -> Self {
        Self { stack: vec![] }
    }

    fn next(&mut self, price: i32) -> i32 {
        let mut span = 1;

        while !self.stack.is_empty() && self.stack.last().unwrap().0 <= price {
            span += self.stack.pop().unwrap().1;
        }
        self.stack.push((price, span));
        span
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        let mut obj = StockSpanner::new();
        assert_eq!(obj.next(100), 1);
        assert_eq!(obj.next(80), 1);
        assert_eq!(obj.next(60), 1);
        assert_eq!(obj.next(70), 2);
        assert_eq!(obj.next(60), 1);
        assert_eq!(obj.next(75), 4);
        assert_eq!(obj.next(85), 6);
    }
}
