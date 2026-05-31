struct Solution;

use std::collections::VecDeque;

impl Solution {
    pub fn push_dominoes(dominoes: String) -> String {
        let mut dom: Vec<char> = dominoes.chars().collect();
        let mut q = VecDeque::new();

        for (i, &d) in dom.iter().enumerate() {
            if d != '.' {
                q.push_back((i, d));
            }
        }

        while let Some((i, d)) = q.pop_front() {
            if d == 'L' && i > 0 && dom[i - 1] == '.' {
                q.push_back((i - 1, 'L'));
                dom[i - 1] = 'L';
            } else if d == 'R' && i + 1 < dom.len() && dom[i + 1] == '.' {
                if i + 2 < dom.len() && dom[i + 2] == 'L' {
                    q.pop_front();
                } else {
                    q.push_back((i + 1, 'R'));
                    dom[i + 1] = 'R';
                }
            }
        }

        dom.into_iter().collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::push_dominoes(String::from("RR.L")),
            String::from("RR.L")
        );
        assert_eq!(
            Solution::push_dominoes(String::from(".L.R...LR..L..")),
            String::from("LL.RR.LLRRLL..")
        );
    }
}
