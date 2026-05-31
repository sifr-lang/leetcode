use std::collections::HashMap;

#[derive(Default)]
struct TrieNode {
    children: HashMap<char, TrieNode>,
    word: i32,
}

struct WordFilter {
    root: TrieNode,
}

impl WordFilter {
    pub fn new(words: Vec<String>) -> Self {
        let mut root = TrieNode {
            children: HashMap::new(),
            word: -1,
        };

        for (index, word) in words.iter().enumerate() {
            let chars: Vec<char> = word.chars().collect();
            for i in 0..=chars.len() {
                for j in 0..=chars.len() {
                    let mut key = String::new();
                    for ch in &chars[i..] {
                        key.push(*ch);
                    }
                    key.push('{');
                    for ch in &chars[..j] {
                        key.push(*ch);
                    }

                    let mut current = &mut root;
                    for ch in key.chars() {
                        current = current.children.entry(ch).or_insert_with(|| TrieNode {
                            children: HashMap::new(),
                            word: -1,
                        });
                    }
                    current.word = index as i32;
                }
            }
        }

        Self { root }
    }

    pub fn f(&self, pref: String, suff: String) -> i32 {
        let key = format!("{suff}{{{pref}");
        let mut current = &self.root;
        for ch in key.chars() {
            match current.children.get(&ch) {
                Some(next) => current = next,
                None => return -1,
            }
        }
        current.word
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let obj = WordFilter::new(vec!["apple".to_string()]);
        assert_eq!(obj.f("a".to_string(), "e".to_string()), 0);
    }
}
