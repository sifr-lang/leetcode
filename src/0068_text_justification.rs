struct Solution;

impl Solution {
    pub fn full_justify(words: Vec<String>, max_width: i32) -> Vec<String> {
        let max_width = max_width as usize;
        let mut res = Vec::new();
        let mut line: Vec<String> = Vec::new();
        let mut length = 0;
        let mut i = 0;

        while i < words.len() {
            if length + line.len() + words[i].len() > max_width {
                let extra_space = max_width - length;
                let word_cnt = line.len().saturating_sub(1);
                let spaces = extra_space / word_cnt.max(1);
                let mut remainder = extra_space % word_cnt.max(1);

                for item in line.iter_mut().take(word_cnt.max(1)) {
                    item.push_str(&" ".repeat(spaces));
                    if remainder > 0 {
                        item.push(' ');
                        remainder -= 1;
                    }
                }

                res.push(line.join(""));
                line = Vec::new();
                length = 0;
            }

            length += words[i].len();
            line.push(words[i].clone());
            i += 1;
        }

        let last_line = line.join(" ");
        let trail_spaces = max_width - last_line.len();
        res.push(format!("{}{}", last_line, " ".repeat(trail_spaces)));
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::full_justify(
                vec![
                    String::from("This"),
                    String::from("is"),
                    String::from("an"),
                    String::from("example"),
                    String::from("of"),
                    String::from("text"),
                    String::from("justification.")
                ],
                16
            ),
            vec![
                String::from("This    is    an"),
                String::from("example  of text"),
                String::from("justification.  ")
            ]
        );
        assert_eq!(
            Solution::full_justify(
                vec![
                    String::from("What"),
                    String::from("must"),
                    String::from("be"),
                    String::from("acknowledgment"),
                    String::from("shall"),
                    String::from("be")
                ],
                16
            ),
            vec![
                String::from("What   must   be"),
                String::from("acknowledgment  "),
                String::from("shall be        ")
            ]
        );
        assert_eq!(
            Solution::full_justify(
                vec![
                    String::from("Science"),
                    String::from("is"),
                    String::from("what"),
                    String::from("we"),
                    String::from("understand"),
                    String::from("well"),
                    String::from("enough"),
                    String::from("to"),
                    String::from("explain"),
                    String::from("to"),
                    String::from("a"),
                    String::from("computer."),
                    String::from("Art"),
                    String::from("is"),
                    String::from("everything"),
                    String::from("else"),
                    String::from("we"),
                    String::from("do")
                ],
                20
            ),
            vec![
                String::from("Science  is  what we"),
                String::from("understand      well"),
                String::from("enough to explain to"),
                String::from("a  computer.  Art is"),
                String::from("everything  else  we"),
                String::from("do                  ")
            ]
        );
    }
}
