pub fn successful_pairs(spells: Vec<i32>, mut potions: Vec<i32>, success: i64) -> Vec<i32> {
    let mut pairs = Vec::new();
    potions.sort();
    let n = potions.len();

    for spell in spells {
        let mut l = 0_usize;
        let mut r = potions.len();

        while l < r {
            let m = (l + r) / 2;
            if i64::from(spell) * i64::from(potions[m]) >= success {
                r = m;
            } else {
                l = m + 1;
            }
        }
        if l < potions.len() {
            pairs.push((n - l) as i32);
        } else {
            pairs.push(0);
        }
    }

    pairs
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            successful_pairs(vec![5, 1, 3], vec![1, 2, 3, 4, 5], 7),
            vec![4, 0, 3]
        );
    }
}
