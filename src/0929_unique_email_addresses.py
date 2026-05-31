
# LeetCode 929: Unique Email Addresses
# Python version

def numUniqueEmails(emails: list[str]) -> int:
    unique_emails: set[str] = set()
    for email in emails:
        normalized = ""
        in_domain = False
        skip_local = False
        for ch in email:
            if ch == "@":
                in_domain = True
                normalized += ch
            elif in_domain:
                normalized += ch
            elif ch == "+":
                skip_local = True
            elif not skip_local and ch != ".":
                normalized += ch
        unique_emails.add(normalized)
    return len(unique_emails)



def main():
    assert numUniqueEmails(['test.email+alex@leetcode.com', 'test.e.mail+bob.cathy@leetcode.com', 'testemail+david@lee.tcode.com']) == 2
    assert numUniqueEmails(['a@leetcode.com', 'b@leetcode.com', 'c@leetcode.com']) == 3

if __name__ == "__main__":
    main()
