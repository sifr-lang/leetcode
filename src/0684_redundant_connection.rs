struct Solution;

fn find(n: usize, parent: &mut [usize]) -> usize {
    let mut p = parent[n];
    while p != parent[p] {
        parent[p] = parent[parent[p]];
        p = parent[p];
    }
    p
}

fn union(n1: usize, n2: usize, parent: &mut [usize], rank: &mut [i32]) -> bool {
    let p1 = find(n1, parent);
    let p2 = find(n2, parent);

    if p1 == p2 {
        return false;
    }

    if rank[p1] > rank[p2] {
        parent[p2] = p1;
        rank[p1] += rank[p2];
    } else {
        parent[p1] = p2;
        rank[p2] += rank[p1];
    }

    true
}

impl Solution {
    pub fn find_redundant_connection(edges: Vec<Vec<i32>>) -> Vec<i32> {
        let mut parent = (0..=edges.len()).collect::<Vec<_>>();
        let mut rank = vec![1; edges.len() + 1];

        for edge in edges {
            let n1 = edge[0] as usize;
            let n2 = edge[1] as usize;
            if !union(n1, n2, &mut parent, &mut rank) {
                return vec![n1 as i32, n2 as i32];
            }
        }

        Vec::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::find_redundant_connection(vec![vec![1, 2], vec![1, 3], vec![2, 3]]),
            vec![2, 3]
        );
        assert_eq!(
            Solution::find_redundant_connection(vec![
                vec![1, 2],
                vec![2, 3],
                vec![3, 4],
                vec![1, 4],
                vec![1, 5]
            ]),
            vec![1, 4]
        );
    }
}
