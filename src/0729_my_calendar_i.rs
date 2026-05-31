struct MyCalendar {
    calendar: Box<CalendarNode>,
}

impl MyCalendar {
    fn new() -> Self {
        Self {
            calendar: Box::new(CalendarNode::new(-1, -1)),
        }
    }

    fn book(&mut self, start: i32, end: i32) -> bool {
        fn book_helper(cur: &mut CalendarNode, target_start: i32, target_end: i32) -> bool {
            if target_start > cur.end {
                if cur.right.is_none() {
                    cur.right = Some(Box::new(CalendarNode::new(target_start, target_end)));
                    return true;
                }
                return book_helper(cur.right.as_mut().unwrap(), target_start, target_end);
            } else if target_end < cur.start {
                if cur.left.is_none() {
                    cur.left = Some(Box::new(CalendarNode::new(target_start, target_end)));
                    return true;
                }
                return book_helper(cur.left.as_mut().unwrap(), target_start, target_end);
            }
            false
        }

        book_helper(&mut self.calendar, start, end - 1)
    }
}

struct CalendarNode {
    start: i32,
    end: i32,
    left: Option<Box<CalendarNode>>,
    right: Option<Box<CalendarNode>>,
}

impl CalendarNode {
    fn new(start: i32, end: i32) -> Self {
        Self {
            start,
            end,
            left: None,
            right: None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut obj = MyCalendar::new();
        assert_eq!(obj.book(10, 20), true);
        assert_eq!(obj.book(15, 25), false);
        assert_eq!(obj.book(20, 30), true);
    }
}
