use std::collections::HashMap;

struct DetectSquares {
    points: Vec<(i32, i32)>,
    counts: HashMap<(i32, i32), i32>,
}

impl DetectSquares {
    fn new() -> Self {
        Self {
            points: vec![],
            counts: HashMap::new(),
        }
    }

    fn add(&mut self, point: Vec<i32>) {
        let p = (point[0], point[1]);
        self.points.push(p);
        *self.counts.entry(p).or_default() += 1;
    }

    fn count(&self, point: Vec<i32>) -> i32 {
        let mut res = 0;
        let (px, py) = (point[0], point[1]);
        for (x, y) in self.points.iter() {
            if (py - y).abs() != (px - x).abs() || *x == px || *y == py {
                continue;
            }
            res +=
                self.counts.get(&(*x, py)).unwrap_or(&0) * self.counts.get(&(px, *y)).unwrap_or(&0);
        }

        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut obj = DetectSquares::new();
        obj.add(vec![3, 10]);
        obj.add(vec![11, 2]);
        obj.add(vec![3, 2]);
        assert_eq!(obj.count(vec![11, 10]), 1);
        assert_eq!(obj.count(vec![14, 8]), 0);
        obj.add(vec![11, 2]);
        assert_eq!(obj.count(vec![11, 10]), 2);
    }
}
