pub fn encode(strs: Vec<String>) -> String {
    let mut result = String::new();
    for value in strs {
        result.push_str(&value.len().to_string());
        result.push('#');
        result.push_str(&value);
    }
    result
}

pub fn decode(s: String) -> Vec<String> {
    let bytes = s.as_bytes();
    let mut result = Vec::new();
    let mut i = 0;
    while i < bytes.len() {
        let mut j = i;
        while bytes[j] != b'#' {
            j += 1;
        }
        let length = s[i..j].parse::<usize>().unwrap();
        i = j + 1;
        j = i + length;
        result.push(s[i..j].to_string());
        i = j;
    }
    result
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            encode(vec![String::from("Hello"), String::from("World")]),
            String::from("5#Hello5#World")
        );
        assert_eq!(encode(vec![String::from("")]), String::from("0#"));
    }
}
