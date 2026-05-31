struct UnionFind {
    par: Vec<usize>,
    rank: Vec<i32>,
}

impl UnionFind {
    fn new(n: usize) -> Self {
        Self {
            par: (0..n).collect(),
            rank: vec![1; n],
        }
    }

    fn find(&mut self, mut v: usize) -> usize {
        while v != self.par[v] {
            self.par[v] = self.par[self.par[v]];
            v = self.par[v];
        }
        v
    }

    fn union(&mut self, v1: usize, v2: usize) -> bool {
        let p1 = self.find(v1);
        let p2 = self.find(v2);
        if p1 == p2 {
            return false;
        }

        if self.rank[p1] > self.rank[p2] {
            self.par[p2] = p1;
            self.rank[p1] += self.rank[p2];
        } else {
            self.par[p1] = p2;
            self.rank[p2] += self.rank[p1];
        }
        true
    }
}

struct Solution;

impl Solution {
    pub fn find_critical_and_pseudo_critical_edges(n: i32, edges: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
        let n = n as usize;
        let mut edges: Vec<[i32; 4]> = edges
            .into_iter()
            .enumerate()
            .map(|(i, e)| [e[0], e[1], e[2], i as i32])
            .collect();
        edges.sort_by_key(|e| e[2]);

        let mut mst_weight = 0;
        let mut uf = UnionFind::new(n);
        for [v1, v2, w, _] in &edges {
            if uf.union(*v1 as usize, *v2 as usize) {
                mst_weight += *w;
            }
        }

        let mut critical = Vec::new();
        let mut pseudo = Vec::new();
        for [n1, n2, edge_weight, i] in &edges {
            let mut weight = 0;
            let mut uf = UnionFind::new(n);
            for [v1, v2, w, j] in &edges {
                if i != j && uf.union(*v1 as usize, *v2 as usize) {
                    weight += *w;
                }
            }

            if uf.rank.iter().copied().max().unwrap_or(0) != n as i32 || weight > mst_weight {
                critical.push(*i);
                continue;
            }

            let mut uf = UnionFind::new(n);
            uf.union(*n1 as usize, *n2 as usize);
            let mut weight = *edge_weight;
            for [v1, v2, w, _] in &edges {
                if uf.union(*v1 as usize, *v2 as usize) {
                    weight += *w;
                }
            }
            if weight == mst_weight {
                pseudo.push(*i);
            }
        }

        vec![critical, pseudo]
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn main_asserts() {
        assert_eq!(
            Solution::find_critical_and_pseudo_critical_edges(
                5,
                vec![
                    vec![0, 1, 1],
                    vec![1, 2, 1],
                    vec![2, 3, 2],
                    vec![0, 3, 2],
                    vec![0, 4, 3],
                    vec![3, 4, 3],
                    vec![1, 4, 6],
                ]
            ),
            vec![vec![0, 1], vec![2, 3, 4, 5]]
        );
        assert_eq!(
            Solution::find_critical_and_pseudo_critical_edges(
                4,
                vec![vec![0, 1, 1], vec![1, 2, 1], vec![2, 3, 1], vec![0, 3, 1],]
            ),
            vec![vec![], vec![0, 1, 2, 3]]
        );
    }
}
