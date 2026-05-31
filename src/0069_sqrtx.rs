pub fn my_sqrt(x: i64) -> i64 {
    let mut l = 0_i64;
    let mut r = x;

    while l <= r {
        let mid = (l + r) / 2;
        if mid * mid == x {
            return mid;
        }
        if mid * mid < x {
            l = mid + 1;
        } else {
            r = mid - 1;
        }
    }

    r
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(my_sqrt(4), 2);
        assert_eq!(my_sqrt(8), 2);
        assert_eq!(my_sqrt(0), 0);
    }
}
