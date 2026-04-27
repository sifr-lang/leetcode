# Sifr LeetCode Audit Corpus

This repository contains LeetCode-style Sifr fixtures used to audit algorithmic
compatibility and compare Sifr behavior against paired Python references.

Fixtures live under `src/`. Each problem usually has a `.sifr` fixture and a
paired `.py` reference with the same stem.

## Use With `sifr-lang/sifr`

Use this repository from a `sifr-lang/sifr` checkout. The expected path is:

```bash
audits/leetcode
```

Fixture paths are then rooted at `audits/leetcode/src`.

To clone or update the corpus, run this from the Sifr checkout:

```bash
scripts/clone_subrepos.sh
```

That script is idempotent: it clones missing sub-repositories and updates
existing ones.

## Repository Layout

- `src/` contains the LeetCode `.sifr` fixtures and paired Python references.
- `run_audit.py` runs the current corpus audit helper.

## Common Commands

Run the audit helper from this repository root:

```bash
python3 run_audit.py
```
