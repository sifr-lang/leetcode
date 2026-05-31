struct Solution;

use std::collections::HashSet;

impl Solution {
    pub fn num_unique_emails(emails: Vec<String>) -> i32 {
        let mut unique_emails = HashSet::new();

        for email in emails {
            let (local, domain) = email.split_once("@").unwrap();

            let mut local = local.split("+").take(1).next().unwrap().replace(".", "");

            local = format!("{}@{}", local, domain);

            unique_emails.insert(local);
        }
        unique_emails.len() as i32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mirrors_python_main_assertions() {
        assert_eq!(
            Solution::num_unique_emails(vec![
                String::from("test.email+alex@leetcode.com"),
                String::from("test.e.mail+bob.cathy@leetcode.com"),
                String::from("testemail+david@lee.tcode.com")
            ]),
            2
        );
        assert_eq!(
            Solution::num_unique_emails(vec![
                String::from("a@leetcode.com"),
                String::from("b@leetcode.com"),
                String::from("c@leetcode.com")
            ]),
            3
        );
    }
}
