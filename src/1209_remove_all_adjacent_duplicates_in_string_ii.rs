struct Solution;

impl Solution {
    pub fn remove_duplicates(s: String, k: i32) -> String {
        let mut stack: Vec<(char, usize)> = vec![];
        for ch in s.chars() {
            if !stack.is_empty() && stack.last().unwrap().0 == ch {
                let mut last = stack.pop().unwrap();
                last.1 += 1;
                stack.push(last);
            } else {
                stack.push((ch, 1));
            }
            if stack.last().unwrap().1 == k as usize {
                stack.pop();
            }
        }

        stack.iter().fold(String::new(), |acc, &(ch, count)| {
            acc + &ch.to_string().repeat(count)
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::remove_duplicates("abcd".to_string(), 2),
            "abcd".to_string()
        );
        assert_eq!(
            Solution::remove_duplicates("deeedbbcccbdaa".to_string(), 3),
            "aa".to_string()
        );
    }
}
