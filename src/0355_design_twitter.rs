use std::cmp::Reverse;
use std::collections::{BinaryHeap, HashMap, HashSet};

struct Twitter {
    count: i32,
    tweet_map: HashMap<i32, Vec<(i32, i32)>>,
    follow_map: HashMap<i32, HashSet<i32>>,
}

impl Twitter {
    fn new() -> Self {
        Self {
            count: 0,
            tweet_map: HashMap::new(),
            follow_map: HashMap::new(),
        }
    }

    fn post_tweet(&mut self, user_id: i32, tweet_id: i32) {
        self.tweet_map
            .entry(user_id)
            .or_default()
            .push((self.count, tweet_id));
        self.count -= 1;
    }

    fn get_news_feed(&mut self, user_id: i32) -> Vec<i32> {
        let mut result = Vec::new();
        let mut heap: BinaryHeap<Reverse<(i32, i32, i32, i32)>> = BinaryHeap::new();
        self.follow_map.entry(user_id).or_default().insert(user_id);

        if let Some(followees) = self.follow_map.get(&user_id) {
            for followee_id in followees {
                if let Some(tweets) = self.tweet_map.get(followee_id) {
                    if let Some(index) = tweets.len().checked_sub(1) {
                        let (count, tweet_id) = tweets[index];
                        heap.push(Reverse((count, tweet_id, *followee_id, index as i32 - 1)));
                    }
                }
            }
        }

        while let Some(Reverse((_, tweet_id, followee_id, index))) = heap.pop() {
            if result.len() == 10 {
                break;
            }
            result.push(tweet_id);
            if index >= 0 {
                if let Some(tweets) = self.tweet_map.get(&followee_id) {
                    let (count, next_tweet_id) = tweets[index as usize];
                    heap.push(Reverse((count, next_tweet_id, followee_id, index - 1)));
                }
            }
        }

        result
    }

    fn follow(&mut self, follower_id: i32, followee_id: i32) {
        self.follow_map
            .entry(follower_id)
            .or_default()
            .insert(followee_id);
    }

    fn unfollow(&mut self, follower_id: i32, followee_id: i32) {
        if let Some(followees) = self.follow_map.get_mut(&follower_id) {
            followees.remove(&followee_id);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        let mut obj = Twitter::new();
        obj.post_tweet(1, 5);
        assert_eq!(obj.get_news_feed(1), vec![5]);
        obj.follow(1, 2);
        obj.post_tweet(2, 6);
        assert_eq!(obj.get_news_feed(1), vec![6, 5]);
        obj.unfollow(1, 2);
        assert_eq!(obj.get_news_feed(1), vec![5]);
    }
}
