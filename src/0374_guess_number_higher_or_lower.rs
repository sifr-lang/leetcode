struct Solution;

const PICK: i32 = 6;

fn guess(num: i32) -> i32 {
    if num == PICK {
        0
    } else if num < PICK {
        1
    } else {
        -1
    }
}

impl Solution {
    pub fn guess_number(n: i32) -> i32 {
        let mut low = 1;
        let mut high = n;

        while low <= high {
            let mid = low + (high - low) / 2;
            let my_guess = guess(mid);
            if my_guess == 1 {
                low = mid + 1;
            } else if my_guess == -1 {
                high = mid - 1;
            } else {
                return mid;
            }
        }
        -1
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(Solution::guess_number(10), 6);
        assert_eq!(Solution::guess_number(6), 6);
    }
}
