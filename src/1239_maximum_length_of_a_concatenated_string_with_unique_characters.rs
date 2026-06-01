struct Solution;

impl Solution {
    pub fn max_length(arr: Vec<String>) -> i32 {
        let mut masks = vec![0_i32];
        let mut best = 0_i32;

        for word in arr {
            let mut word_mask = 0_i32;
            let mut valid_word = true;

            for byte in word.bytes() {
                if !byte.is_ascii_lowercase() {
                    valid_word = false;
                    break;
                }

                let bit_mask = 1_i32 << (byte - b'a');
                if (word_mask & bit_mask) != 0 {
                    valid_word = false;
                    break;
                }
                word_mask |= bit_mask;
            }

            if !valid_word {
                continue;
            }

            let existing = masks.len();
            for i in 0..existing {
                let base_mask = masks[i];
                if (base_mask & word_mask) == 0 {
                    let combined = base_mask | word_mask;
                    masks.push(combined);
                    best = best.max(combined.count_ones() as i32);
                }
            }
        }

        best
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::max_length(vec![
                String::from("un"),
                String::from("iq"),
                String::from("ue")
            ]),
            4
        );
        assert_eq!(
            Solution::max_length(vec![
                String::from("cha"),
                String::from("r"),
                String::from("act"),
                String::from("ers")
            ]),
            6
        );
        assert_eq!(
            Solution::max_length(vec![String::from("abcdefghijklmnopqrstuvwxyz")]),
            26
        );
    }
}
