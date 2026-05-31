use std::collections::HashMap;

struct Codec {
    encode_map: HashMap<String, String>,
    decode_map: HashMap<String, String>,
    base: String,
}

impl Codec {
    fn new() -> Self {
        Self {
            encode_map: HashMap::new(),
            decode_map: HashMap::new(),
            base: "http://tinyurl.com/".to_string(),
        }
    }

    fn encode(&mut self, long_url: String) -> String {
        if !self.encode_map.contains_key(&long_url) {
            let short_url = format!("{}{}", self.base, self.encode_map.len() + 1);
            self.encode_map.insert(long_url.clone(), short_url.clone());
            self.decode_map.insert(short_url, long_url.clone());
        }

        self.encode_map[&long_url].clone()
    }

    fn decode(&self, short_url: String) -> String {
        self.decode_map[&short_url].clone()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut codec = Codec::new();
        let url = String::from("https://leetcode.com/problems/design-tinyurl");
        let short_url = codec.encode(url.clone());
        assert_eq!(short_url, String::from("http://tinyurl.com/1"));
        assert_eq!(codec.decode(short_url.clone()), url);
        assert_eq!(codec.encode(url.clone()), short_url);
    }
}
