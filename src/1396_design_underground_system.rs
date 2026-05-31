use std::collections::HashMap;

pub struct UndergroundSystem {
    customer: HashMap<i32, (String, i32)>,
    time: HashMap<(String, String), [i32; 2]>,
}

impl UndergroundSystem {
    pub fn new() -> Self {
        Self {
            customer: HashMap::new(),
            time: HashMap::new(),
        }
    }

    pub fn check_in(&mut self, id: i32, station_name: String, t: i32) {
        self.customer.insert(id, (station_name, t));
    }

    pub fn check_out(&mut self, id: i32, station_name: String, t: i32) {
        let (start, time) = self.customer.get(&id).unwrap().clone();
        let route = (start, station_name);
        let entry = self.time.entry(route).or_insert([0, 0]);
        entry[0] += t - time;
        entry[1] += 1;
    }

    pub fn get_average_time(&self, start_station: String, end_station: String) -> f64 {
        let total = self.time.get(&(start_station, end_station)).unwrap();
        f64::from(total[0]) / f64::from(total[1])
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut obj = UndergroundSystem::new();
        obj.check_in(45, String::from("Leyton"), 3);
        obj.check_in(32, String::from("Paradise"), 8);
        obj.check_in(27, String::from("Leyton"), 10);
        obj.check_out(45, String::from("Waterloo"), 15);
        obj.check_out(27, String::from("Waterloo"), 20);
        obj.check_out(32, String::from("Cambridge"), 22);
        assert_eq!(
            obj.get_average_time(String::from("Paradise"), String::from("Cambridge")),
            14.0
        );
        assert_eq!(
            obj.get_average_time(String::from("Leyton"), String::from("Waterloo")),
            11.0
        );
        obj.check_in(10, String::from("Leyton"), 24);
        assert_eq!(
            obj.get_average_time(String::from("Leyton"), String::from("Waterloo")),
            11.0
        );
        obj.check_out(10, String::from("Waterloo"), 38);
        assert_eq!(
            obj.get_average_time(String::from("Leyton"), String::from("Waterloo")),
            12.0
        );
    }
}
