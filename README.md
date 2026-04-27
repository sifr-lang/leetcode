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
- `scripts/` contains LeetCode corpus maintenance and Phase 31 audit tooling.
- `verification/leetcode/` contains generated manifests, run results, scorecards,
  taxonomies, and other corpus audit artifacts.
- `internal_docs/` contains LeetCode-specific design and verification notes.

## Common Commands

Run these from this repository root:

```bash
python3 scripts/test_phase31_leetcode.py
python3 scripts/scan_leetcode_pair_diffs.py --top 25
```

To run fixtures against a checked-out `sifr-lang/sifr` compiler, either place
this repository at `audits/leetcode` inside the Sifr checkout or pass an explicit
compiler binary:

```bash
python3 scripts/run_phase31_leetcode.py \
  --manifest verification/leetcode/phase31_seed_corpus.json \
  --output /tmp/leetcode_seed_results.json \
  --case 0001 \
  --sifr-bin ../../target/release/sifr \
  --no-build-release-if-missing
```
