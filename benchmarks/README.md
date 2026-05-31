# LeetCode Benchmarks

This directory contains cross-language benchmarks for the LeetCode audit corpus.
The maintained surface is intentionally small:

- `problems/<category>.json` declares benchmarkable problems and size sweeps.
  The current registry includes two Python/Sifr audit problems from each
  algorithm category in `/Users/yaseralnajjar/work/sifr/leetcode/README.md`;
  the README's JavaScript section is not an algorithm category and is excluded.
- `harnesses/generic.py` owns data-driven benchmark execution: expected output
  solving, Python execution, and full Sifr runner generation from each
  problem's `runner` declaration in `problems/<category>.json`.
- `cases/<category>/<problem_id>.py` owns problem-specific deterministic input
  generation only.
- `generate_fixtures.py` runs each problem case generator, invokes the Python
  reference through the declared generic runner once per fixture to produce
  expected output, and writes fixture pairs.
- `bench.py` builds generated Sifr runners, renders Node.js runners,
  verifies correctness, invokes `hyperfine` for runtime, captures
  `/usr/bin/time` RSS samples, and summarizes results. Use repeatable
  `--language` flags to choose any subset of `python`, `sifr`, and `nodejs`.
- `report.py` renders the static HTML report from existing JSON results.
- `specs.py` contains shared registry/path helpers used by the tools.
- `fixtures/` stores checked-in deterministic input/output pairs.

Generated Sifr entrypoints and native binaries are written under `generated/`.
Raw benchmark exports are written under `results/.raw`; the rendered HTML report
is written to `results/report.html`. These generated paths are ignored by Git.

## Commands

Generate deterministic fixtures:

```bash
python3 benchmarks/generate_fixtures.py
```

Build generated Sifr and Node.js runners:

```bash
python3 benchmarks/bench.py build
```

Run the full benchmark suite with production defaults:

```bash
python3 benchmarks/generate_fixtures.py
python3 benchmarks/bench.py run
python3 benchmarks/bench.py report-html
```

Run a quick smoke benchmark:

```bash
python3 benchmarks/generate_fixtures.py 0001_two_sum
python3 benchmarks/bench.py run --runs 2 --warmup 1 0001_two_sum
```

Run only selected implementations:

```bash
python3 benchmarks/bench.py run --language python --language nodejs 0001_two_sum
python3 benchmarks/bench.py report-html --language python --language nodejs
```

If the Sifr compiler binary is not at `../../target/release/sifr` or
`../../target/debug/sifr`, set `SIFR_BIN`:

```bash
SIFR_BIN=/path/to/sifr python3 benchmarks/bench.py run
```

The HTML report is written to `benchmarks/results/report.html`. It is generated
from raw JSON exports in `benchmarks/results/.raw` and includes
speedup, CPU user/system time, throughput, per-operation cost, peak RSS,
p50/min/max, and variance status.
