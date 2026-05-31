use std::collections::HashMap;

pub struct ParkingSystem {
    parking: HashMap<i32, [i32; 2]>,
}

impl ParkingSystem {
    pub fn new(big: i32, medium: i32, small: i32) -> Self {
        let mut parking = HashMap::new();
        parking.insert(1, [0, big]);
        parking.insert(2, [0, medium]);
        parking.insert(3, [0, small]);
        Self { parking }
    }

    pub fn add_car(&mut self, car_type: i32) -> bool {
        let entry = self.parking.get_mut(&car_type).unwrap();
        let new_total = entry[0] + 1;
        if new_total <= entry[1] {
            entry[0] += 1;
            return true;
        }
        false
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut obj = ParkingSystem::new(1, 1, 0);
        assert_eq!(obj.add_car(1), true);
        assert_eq!(obj.add_car(2), true);
        assert_eq!(obj.add_car(3), false);
        assert_eq!(obj.add_car(1), false);
    }
}
