use std::collections::HashMap;

struct UnionFind {
    par: Vec<usize>,
    size: Vec<i32>,
    count: i32,
}

impl UnionFind {
    fn new(n: usize) -> Self {
        Self {
            par: (0..n).collect(),
            size: vec![1; n],
            count: n as i32,
        }
    }

    fn find(&mut self, x: usize) -> usize {
        if self.par[x] != x {
            self.par[x] = self.find(self.par[x]);
        }
        self.par[x]
    }

    fn union(&mut self, x: usize, y: usize) {
        let px = self.find(x);
        let py = self.find(y);
        if px == py {
            return;
        }

        if self.size[px] < self.size[py] {
            self.par[px] = py;
            self.size[py] += self.size[px];
        } else {
            self.par[py] = px;
            self.size[px] += self.size[py];
        }
        self.count -= 1;
    }
}

struct Solution;

impl Solution {
    pub fn can_traverse_all_pairs(nums: Vec<i32>) -> bool {
        let mut uf = UnionFind::new(nums.len());
        let mut factor_index = HashMap::new();

        for (i, n) in nums.into_iter().enumerate() {
            let mut n = n;
            let mut f = 2;
            while f * f <= n {
                if n % f == 0 {
                    if let Some(j) = factor_index.get(&f) {
                        uf.union(i, *j);
                    } else {
                        factor_index.insert(f, i);
                    }
                    while n % f == 0 {
                        n /= f;
                    }
                }
                f += 1;
            }
            if n > 1 {
                if let Some(j) = factor_index.get(&n) {
                    uf.union(i, *j);
                } else {
                    factor_index.insert(n, i);
                }
            }
        }

        uf.count == 1
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn main_asserts() {
        assert_eq!(Solution::can_traverse_all_pairs(vec![2, 3, 6]), true);
        assert_eq!(Solution::can_traverse_all_pairs(vec![3, 9, 5]), false);
        assert_eq!(Solution::can_traverse_all_pairs(vec![4, 3, 12, 8]), true);
    }
}
