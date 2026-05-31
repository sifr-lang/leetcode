use std::collections::VecDeque;

struct Solution;

impl Solution {
    pub fn topological_sort(
        successors: Vec<Vec<i32>>,
        mut predecessors_count: Vec<i32>,
        num_nodes: i32,
    ) -> Vec<i32> {
        let mut order = Vec::new();
        let mut nodes_with_no_predecessors = VecDeque::new();
        for node in 0..num_nodes as usize {
            if predecessors_count[node] == 0 {
                nodes_with_no_predecessors.push_back(node);
            }
        }

        while let Some(node) = nodes_with_no_predecessors.pop_front() {
            order.push(node as i32);
            for &successor in &successors[node] {
                let successor = successor as usize;
                predecessors_count[successor] -= 1;
                if predecessors_count[successor] == 0 {
                    nodes_with_no_predecessors.push_back(successor);
                }
            }
        }

        if order.len() == num_nodes as usize {
            order
        } else {
            Vec::new()
        }
    }

    #[allow(dead_code)]
    pub fn sort_items(
        n: i32,
        mut m: i32,
        mut group: Vec<i32>,
        before_items: Vec<Vec<i32>>,
    ) -> Vec<i32> {
        for item in 0..n as usize {
            if group[item] == -1 {
                group[item] = m;
                m += 1;
            }
        }

        let mut successors_group = vec![Vec::new(); m as usize];
        let mut successors_item = vec![Vec::new(); n as usize];
        let mut predecessors_count_group = vec![0; m as usize];
        let mut predecessors_count_item = vec![0; n as usize];

        for item in 0..n as usize {
            let current_group = group[item];
            for &before in &before_items[item] {
                let before = before as usize;
                let before_group = group[before];
                if current_group == before_group {
                    successors_item[before].push(item as i32);
                    predecessors_count_item[item] += 1;
                } else {
                    successors_group[before_group as usize].push(current_group);
                    predecessors_count_group[current_group as usize] += 1;
                }
            }
        }

        let groups_order = Self::topological_sort(successors_group, predecessors_count_group, m);
        let items_order = Self::topological_sort(successors_item, predecessors_count_item, n);

        if groups_order.is_empty() || items_order.is_empty() {
            return Vec::new();
        }

        let mut items_grouped = vec![Vec::new(); m as usize];
        for item in items_order {
            items_grouped[group[item as usize] as usize].push(item);
        }

        let mut result = Vec::new();
        for grp in groups_order {
            result.extend(items_grouped[grp as usize].iter().copied());
        }
        result
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::topological_sort(vec![vec![0]], vec![0], 0),
            Vec::<i32>::new()
        );
    }
}
