use std::collections::HashMap;

pub fn combination_sum4(nums: Vec<i32>, target: i32) -> i64 {
    let mut cache = HashMap::new();
    cache.insert(0, 1_i64);

    for total in 1..=target {
        cache.insert(total, 0);
        for &num in &nums {
            let add = *cache.get(&(total - num)).unwrap_or(&0);
            if let Some(value) = cache.get_mut(&total) {
                *value += add;
            }
        }
    }

    *cache.get(&target).unwrap_or(&0)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(combination_sum4(vec![1, 2, 3], 4), 7);
    }
}
