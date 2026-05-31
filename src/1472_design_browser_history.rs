struct BrowserHistory {
    history: Vec<String>,
    current: usize,
}

impl BrowserHistory {
    fn new(homepage: String) -> Self {
        Self {
            history: vec![homepage],
            current: 0,
        }
    }

    fn visit(&mut self, url: String) {
        self.current += 1;
        self.history.splice(self.current.., std::iter::once(url));
    }

    fn back(&mut self, steps: i32) -> String {
        self.current = self.current.saturating_sub(steps as usize);
        self.history[self.current].clone()
    }

    fn forward(&mut self, steps: i32) -> String {
        self.current = (self.current + steps as usize).min(self.history.len() - 1);
        self.history[self.current].clone()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut obj = BrowserHistory::new(String::from("leetcode.com"));
        obj.visit(String::from("google.com"));
        obj.visit(String::from("facebook.com"));
        obj.visit(String::from("youtube.com"));
        assert_eq!(obj.back(1), String::from("facebook.com"));
        assert_eq!(obj.back(1), String::from("google.com"));
        assert_eq!(obj.forward(1), String::from("facebook.com"));
        obj.visit(String::from("linkedin.com"));
        assert_eq!(obj.forward(2), String::from("linkedin.com"));
        assert_eq!(obj.back(2), String::from("google.com"));
        assert_eq!(obj.back(7), String::from("leetcode.com"));
    }
}
