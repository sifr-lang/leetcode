struct Solution;

use std::collections::HashMap;

struct UnionFind {
    parent: Vec<usize>,
    rank: Vec<i32>,
}

impl UnionFind {
    fn new(size: usize) -> Self {
        Self {
            parent: (0..size).collect(),
            rank: vec![1; size],
        }
    }

    fn find(&mut self, node: usize) -> usize {
        if self.parent[node] != node {
            let root = self.find(self.parent[node]);
            self.parent[node] = root;
        }
        self.parent[node]
    }

    fn union(&mut self, a: usize, b: usize) {
        let root_a = self.find(a);
        let root_b = self.find(b);
        if root_a == root_b {
            return;
        }
        if self.rank[root_a] < self.rank[root_b] {
            self.parent[root_a] = root_b;
        } else if self.rank[root_a] > self.rank[root_b] {
            self.parent[root_b] = root_a;
        } else {
            self.parent[root_b] = root_a;
            self.rank[root_a] += 1;
        }
    }
}

impl Solution {
    pub fn accounts_merge(accounts: Vec<Vec<String>>) -> Vec<Vec<String>> {
        let mut uf = UnionFind::new(accounts.len());
        let mut email_to_acc: HashMap<String, usize> = HashMap::new();
        let mut email_order: Vec<(String, usize)> = Vec::new();

        for (i, account) in accounts.iter().enumerate() {
            for email in account.iter().skip(1) {
                if let Some(&prev) = email_to_acc.get(email) {
                    uf.union(i, prev);
                } else {
                    email_to_acc.insert(email.clone(), i);
                    email_order.push((email.clone(), i));
                }
            }
        }

        let mut email_group: Vec<(usize, Vec<String>)> = Vec::new();
        for (email, i) in email_order {
            let leader = uf.find(i);
            if let Some((_, emails)) = email_group.iter_mut().find(|(idx, _)| *idx == leader) {
                emails.push(email);
            } else {
                email_group.push((leader, vec![email]));
            }
        }

        let mut res = Vec::new();
        for (i, mut emails) in email_group {
            emails.sort();
            let mut row = vec![accounts[i][0].clone()];
            row.extend(emails);
            res.push(row);
        }
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::accounts_merge(vec![
                vec![
                    "John".to_string(),
                    "johnsmith@mail.com".to_string(),
                    "john_newyork@mail.com".to_string()
                ],
                vec![
                    "John".to_string(),
                    "johnsmith@mail.com".to_string(),
                    "john00@mail.com".to_string()
                ],
                vec!["Mary".to_string(), "mary@mail.com".to_string()],
                vec!["John".to_string(), "johnnybravo@mail.com".to_string()]
            ]),
            vec![
                vec![
                    "John".to_string(),
                    "john00@mail.com".to_string(),
                    "john_newyork@mail.com".to_string(),
                    "johnsmith@mail.com".to_string()
                ],
                vec!["Mary".to_string(), "mary@mail.com".to_string()],
                vec!["John".to_string(), "johnnybravo@mail.com".to_string()]
            ]
        );
        assert_eq!(
            Solution::accounts_merge(vec![
                vec![
                    "Gabe".to_string(),
                    "Gabe0@m.co".to_string(),
                    "Gabe3@m.co".to_string(),
                    "Gabe1@m.co".to_string()
                ],
                vec![
                    "Kevin".to_string(),
                    "Kevin3@m.co".to_string(),
                    "Kevin5@m.co".to_string(),
                    "Kevin0@m.co".to_string()
                ],
                vec![
                    "Ethan".to_string(),
                    "Ethan5@m.co".to_string(),
                    "Ethan4@m.co".to_string(),
                    "Ethan0@m.co".to_string()
                ],
                vec![
                    "Hanzo".to_string(),
                    "Hanzo3@m.co".to_string(),
                    "Hanzo1@m.co".to_string(),
                    "Hanzo0@m.co".to_string()
                ],
                vec![
                    "Fern".to_string(),
                    "Fern5@m.co".to_string(),
                    "Fern1@m.co".to_string(),
                    "Fern0@m.co".to_string()
                ]
            ]),
            vec![
                vec![
                    "Gabe".to_string(),
                    "Gabe0@m.co".to_string(),
                    "Gabe1@m.co".to_string(),
                    "Gabe3@m.co".to_string()
                ],
                vec![
                    "Kevin".to_string(),
                    "Kevin0@m.co".to_string(),
                    "Kevin3@m.co".to_string(),
                    "Kevin5@m.co".to_string()
                ],
                vec![
                    "Ethan".to_string(),
                    "Ethan0@m.co".to_string(),
                    "Ethan4@m.co".to_string(),
                    "Ethan5@m.co".to_string()
                ],
                vec![
                    "Hanzo".to_string(),
                    "Hanzo0@m.co".to_string(),
                    "Hanzo1@m.co".to_string(),
                    "Hanzo3@m.co".to_string()
                ],
                vec![
                    "Fern".to_string(),
                    "Fern0@m.co".to_string(),
                    "Fern1@m.co".to_string(),
                    "Fern5@m.co".to_string()
                ]
            ]
        );
    }
}
