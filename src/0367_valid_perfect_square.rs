pub fn is_perfect_square(num: i64) -> bool {
    let mut i = 1_i64;
    while i <= num {
        if i * i == num {
            return true;
        }
        if i * i > num {
            return false;
        }
        i += 1;
    }
    false
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(is_perfect_square(16), true);
        assert_eq!(is_perfect_square(14), false);
    }
}
