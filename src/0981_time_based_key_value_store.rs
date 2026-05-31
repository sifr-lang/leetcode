use std::collections::HashMap;

struct TimeMap {
    hm: HashMap<String, Vec<(String, i32)>>,
}

impl TimeMap {
    fn new() -> Self {
        Self { hm: HashMap::new() }
    }

    fn set(&mut self, key: String, value: String, timestamp: i32) {
        self.hm.entry(key).or_default().push((value, timestamp));
    }

    fn get(&self, key: String, timestamp: i32) -> String {
        let mut res = String::new();

        if let Some(t_list) = self.hm.get(&key) {
            let (mut l, mut r) = (0, t_list.len());

            while l < r {
                let m = l + (r - l) / 2;
                if timestamp < t_list[m].1 {
                    r = m;
                } else {
                    res = t_list[m].0.clone();
                    l = m + 1;
                }
            }
        }

        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut obj = TimeMap::new();
        obj.set("foo".to_string(), "bar".to_string(), 1);
        assert_eq!(obj.get("foo".to_string(), 1), "bar");
        assert_eq!(obj.get("foo".to_string(), 3), "bar");
        obj.set("foo".to_string(), "bar2".to_string(), 4);
        assert_eq!(obj.get("foo".to_string(), 4), "bar2");
        assert_eq!(obj.get("foo".to_string(), 5), "bar2");
    }
}
