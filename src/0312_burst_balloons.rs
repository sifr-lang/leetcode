use std::collections::HashMap;

pub fn max_coins(nums: Vec<i32>) -> i32 {
    let mut values = Vec::with_capacity(nums.len() + 2);
    values.push(1);
    values.extend(nums);
    values.push(1);

    let mut cache: HashMap<(usize, usize), i32> = HashMap::new();
    for offset in 2..values.len() {
        for left in 0..values.len() - offset {
            let right = left + offset;
            for pivot in left + 1..right {
                let coins = values[left] * values[pivot] * values[right]
                    + *cache.get(&(left, pivot)).unwrap_or(&0)
                    + *cache.get(&(pivot, right)).unwrap_or(&0);
                let current = *cache.get(&(left, right)).unwrap_or(&0);
                cache.insert((left, right), coins.max(current));
            }
        }
    }

    *cache.get(&(0, values.len() - 1)).unwrap_or(&0)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(max_coins(vec![3, 1, 5, 8]), 167);
    }
}
