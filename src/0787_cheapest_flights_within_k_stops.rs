struct Solution;

impl Solution {
    pub fn find_cheapest_price(n: i32, flights: Vec<Vec<i32>>, src: i32, dst: i32, k: i32) -> i32 {
        let mut prices = vec![i32::MAX; n as usize];
        prices[src as usize] = 0;

        for _ in 0..=k {
            let mut tmp_prices = prices.clone();
            for flight in &flights {
                let s = flight[0] as usize;
                let d = flight[1] as usize;
                let p = flight[2];
                if prices[s] == i32::MAX {
                    continue;
                }
                let candidate = prices[s] + p;
                if candidate < tmp_prices[d] {
                    tmp_prices[d] = candidate;
                }
            }
            prices = tmp_prices;
        }

        if prices[dst as usize] == i32::MAX {
            -1
        } else {
            prices[dst as usize]
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::find_cheapest_price(
                4,
                vec![
                    vec![0, 1, 100],
                    vec![1, 2, 100],
                    vec![2, 0, 100],
                    vec![1, 3, 600],
                    vec![2, 3, 200],
                ],
                0,
                3,
                1,
            ),
            700
        );
        assert_eq!(
            Solution::find_cheapest_price(
                3,
                vec![vec![0, 1, 100], vec![1, 2, 100], vec![0, 2, 500]],
                0,
                2,
                1,
            ),
            200
        );
        assert_eq!(
            Solution::find_cheapest_price(
                3,
                vec![vec![0, 1, 100], vec![1, 2, 100], vec![0, 2, 500]],
                0,
                2,
                0,
            ),
            500
        );
    }
}
