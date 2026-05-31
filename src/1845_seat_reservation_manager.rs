use std::cmp::Reverse;
use std::collections::BinaryHeap;

struct SeatManager {
    seats: BinaryHeap<Reverse<i32>>,
}

impl SeatManager {
    fn new(n: i32) -> Self {
        let mut seats = BinaryHeap::new();
        for seat in 1..=n {
            seats.push(Reverse(seat));
        }
        Self { seats }
    }

    fn reserve(&mut self) -> i32 {
        self.seats.pop().map_or(-1, |Reverse(seat)| seat)
    }

    fn unreserve(&mut self, seat_number: i32) {
        self.seats.push(Reverse(seat_number));
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut obj = SeatManager::new(5);
        assert_eq!(obj.reserve(), 1);
        assert_eq!(obj.reserve(), 2);
        obj.unreserve(2);
        assert_eq!(obj.reserve(), 2);
        assert_eq!(obj.reserve(), 3);
        assert_eq!(obj.reserve(), 4);
        assert_eq!(obj.reserve(), 5);
        obj.unreserve(5);
    }
}
