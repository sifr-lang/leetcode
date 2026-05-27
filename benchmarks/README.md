# LeetCode Benchmarks

This directory contains cross-language benchmarks for the LeetCode audit corpus.
The maintained surface is intentionally small:

- `problems.json` declares benchmarkable problems and size sweeps.
- `harnesses/<harness>.py` owns reusable benchmark execution shapes: expected
  output solving, Python execution, and Sifr runner body generation.
- `problems/<problem_id>/cases.py` owns problem-specific deterministic input
  generation only.
- `generate_fixtures.py` runs each problem case generator, invokes the Python
  reference through the configured harness once per fixture to produce expected
  output, and writes fixture pairs.
- `bench.py` builds generated Sifr runners, verifies correctness, invokes
  `hyperfine`, and summarizes results.
- `report.py` renders the static HTML report from existing JSON results.
- `specs.py` contains shared registry/path helpers used by the tools.
- `templates/sifr_runner.sifr.tpl` is the reusable Sifr entrypoint template.
- `fixtures/` stores checked-in deterministic input/output pairs.

Generated Sifr entrypoints and native binaries are written under `generated/`.
Raw hyperfine exports are written under `results/.raw`; the rendered HTML report
is written to `results/report.html`. These generated paths are ignored by Git.

## Commands

Generate deterministic fixtures:

```bash
python3 benchmarks/generate_fixtures.py
```

Build generated Sifr runners:

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

If the Sifr compiler binary is not at `../../target/release/sifr` or
`../../target/debug/sifr`, set `SIFR_BIN`:

```bash
SIFR_BIN=/path/to/sifr python3 benchmarks/bench.py run
```

The HTML report is written to `benchmarks/results/report.html`. It is generated
from raw hyperfine JSON exports in `benchmarks/results/.raw` and includes
speedup, CPU user/system time, throughput, per-operation cost, peak RSS,
p50/min/max, and variance status.
