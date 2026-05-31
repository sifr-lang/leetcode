use std::collections::HashMap;

struct Solution;

impl Solution {
    pub fn find_itinerary(tickets: Vec<Vec<String>>) -> Vec<String> {
        let mut adj: HashMap<String, Vec<String>> = HashMap::new();
        let mut res = Vec::new();

        for ticket in &tickets {
            adj.entry(ticket[0].clone()).or_default();
        }

        for ticket in &tickets {
            adj.get_mut(&ticket[0]).unwrap().push(ticket[1].clone());
        }

        for destinations in adj.values_mut() {
            destinations.sort();
        }

        fn dfs(adj: &mut HashMap<String, Vec<String>>, res: &mut Vec<String>, src: String) {
            if adj.contains_key(&src) {
                let mut destinations = adj[&src].clone();
                while !destinations.is_empty() {
                    let dest = destinations[0].clone();
                    adj.get_mut(&src).unwrap().remove(0);
                    dfs(adj, res, dest);
                    destinations = adj[&src].clone();
                }
            }
            res.push(src);
        }

        dfs(&mut adj, &mut res, String::from("JFK"));
        res.reverse();

        if res.len() != tickets.len() + 1 {
            return Vec::new();
        }

        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn s(value: &str) -> String {
        value.to_string()
    }

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::find_itinerary(vec![
                vec![s("MUC"), s("LHR")],
                vec![s("JFK"), s("MUC")],
                vec![s("SFO"), s("SJC")],
                vec![s("LHR"), s("SFO")]
            ]),
            vec![s("JFK"), s("MUC"), s("LHR"), s("SFO"), s("SJC")]
        );
        assert_eq!(
            Solution::find_itinerary(vec![
                vec![s("JFK"), s("SFO")],
                vec![s("JFK"), s("ATL")],
                vec![s("SFO"), s("ATL")],
                vec![s("ATL"), s("JFK")],
                vec![s("ATL"), s("SFO")]
            ]),
            vec![s("JFK"), s("ATL"), s("JFK"), s("SFO"), s("ATL"), s("SFO")]
        );
    }
}
