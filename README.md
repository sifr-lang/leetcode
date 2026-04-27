# Sifr LeetCode Audit Corpus

This repository contains the Sifr LeetCode audit corpus extracted from
`sifr-lang/sifr`'s former `audits/leetcode` directory.

The history was extracted with `git filter-repo` so commits that changed this
corpus remain available in this repository. File paths are rooted here, so a
former path such as `audits/leetcode/0001_two_sum.sifr` is now
`0001_two_sum.sifr`.

## Use With `sifr-lang/sifr`

The main Sifr repository expects this repository to be cloned at:

```bash
audits/leetcode
```

From a `sifr-lang/sifr` checkout, run:

```bash
scripts/clone_subrepos.sh
```

That script is idempotent: it clones missing sub-repositories and updates
existing ones.
