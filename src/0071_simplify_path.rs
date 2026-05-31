struct Solution;

impl Solution {
    pub fn simplify_path(path: String) -> String {
        let mut stack = vec![];

        for i in path.split("/") {
            match i {
                ".." => {
                    if !stack.is_empty() {
                        stack.pop();
                    }
                }
                "." | "" => continue,
                _ => stack.push(i),
            };
        }

        format!("/{}", stack.join("/"))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::simplify_path("/home/".to_string()),
            "/home".to_string()
        );
        assert_eq!(
            Solution::simplify_path("/home//foo/".to_string()),
            "/home/foo".to_string()
        );
        assert_eq!(
            Solution::simplify_path("/home/user/Documents/../Pictures".to_string()),
            "/home/user/Pictures".to_string()
        );
    }
}
