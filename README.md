# Sifr LeetCode Audit Corpus

This repository contains the Sifr LeetCode audit corpus extracted from
`sifr-lang/sifr`'s former `audits/leetcode` directory.

The history was extracted with `git filter-repo` so commits that changed this
corpus remain available in this repository. Fixtures live under `src/`, so a
former path such as `audits/leetcode/0001_two_sum.sifr` is now
`src/0001_two_sum.sifr`.

## Use With `sifr-lang/sifr`

The main Sifr repository expects this repository to be cloned at:

```bash
audits/leetcode
```

Fixture paths are then rooted at `audits/leetcode/src`.

From a `sifr-lang/sifr` checkout, run:

```bash
scripts/clone_subrepos.sh
```

That script is idempotent: it clones missing sub-repositories and updates
existing ones.

## Repository Layout

- `src/` contains the LeetCode `.sifr` fixtures and paired Python references.
- `run_audit.py`, `convert_all.py`, and `batch_convert.py` are root-level helper
  scripts for the corpus.

## Common Commands

Run these from this repository root:

```bash
python3 run_audit.py
```

Historical Phase 31 reports, generated verification outputs, and old internal
notes were intentionally removed from this repository. The source corpus remains
under `src/`; old generated artifacts can still be recovered from git history
when needed.

```bash
git log --all -- verification/leetcode
```
