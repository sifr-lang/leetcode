fn can_ship(weights: &[i32], days: i32, cap: i32) -> bool {
    let mut ships = 1;
    let mut cur_cap = cap;
    for &weight in weights {
        if cur_cap - weight < 0 {
            ships += 1;
            cur_cap = cap;
        }
        cur_cap -= weight;
    }
    ships <= days
}

pub fn ship_within_days(weights: Vec<i32>, days: i32) -> i32 {
    let mut l = *weights.iter().max().unwrap();
    let mut r: i32 = weights.iter().sum();
    let mut min_cap = r;

    while l <= r {
        let cap = (l + r) / 2;
        if can_ship(&weights, days, cap) {
            min_cap = min_cap.min(cap);
            r = cap - 1;
        } else {
            l = cap + 1;
        }
    }

    min_cap
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(ship_within_days(vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5), 15);
    }
}
