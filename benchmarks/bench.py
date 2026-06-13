#!/usr/bin/env python3
from __future__ import annotations

import argparse
import contextlib
import fcntl
import importlib.util
import json
import platform
import re
import shutil
import statistics
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

import report
from harnesses import generic as harness
from harnesses import nodejs as nodejs_harness
from harnesses import rust as rust_harness
from specs import (
    BIN_DIR,
    GENERATED_DIR,
    NODEJS_GENERATED_DIR,
    RAW_RESULTS_DIR,
    REPO_ROOT,
    RESULTS_DIR,
    RUST_GENERATED_DIR,
    SIFR_GENERATED_DIR,
    ProblemSpec,
    fixture_paths,
    fixture_stem,
    load_problem_specs,
    selected_specs as select_problem_specs,
)

sys.dont_write_bytecode = True

BENCH_ROOT = Path(__file__).resolve().parent
PROBLEMS = load_problem_specs()
DEFAULT_LANGUAGES = ("python", "sifr", "nodejs", "rust")
LANGUAGE_CHOICES = DEFAULT_LANGUAGES

@contextlib.contextmanager
def benchmark_lock():
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    lock_path = GENERATED_DIR / ".benchmark.lock"
    with lock_path.open("w", encoding="utf-8") as lock_file:
        fcntl.flock(lock_file.fileno(), fcntl.LOCK_EX)
        try:
            yield
        finally:
            fcntl.flock(lock_file.fileno(), fcntl.LOCK_UN)

def load_python_function(spec: ProblemSpec) -> Any:
    module_name = f"leetcode_bench_{spec.problem_id}"
    module_spec = importlib.util.spec_from_file_location(module_name, spec.source_py)
    if module_spec is None or module_spec.loader is None:
        raise RuntimeError(f"could not load {spec.source_py}")
    module = importlib.util.module_from_spec(module_spec)
    source_root = str(spec.source_py.parent)
    if source_root not in sys.path:
        sys.path.insert(0, source_root)
    module_spec.loader.exec_module(module)
    return getattr(module, spec.function)

def strip_sifr_main(source: str) -> str:
    lines = source.splitlines()
    for index, line in enumerate(lines):
        if re.match(r"^def\s+main\s*\(", line):
            return "\n".join(lines[:index]).rstrip() + "\n"
    return source.rstrip() + "\n"

def ensure_fixtures(problem_ids: list[str]) -> None:
    missing = []
    for spec in selected_specs(problem_ids):
        for size in spec.sizes:
            fixture_path, expected_path = fixture_paths(spec, size)
            if not fixture_path.exists():
                missing.append(str(fixture_path))
            if not expected_path.exists():
                missing.append(str(expected_path))
    if missing:
        joined = "\n  ".join(missing)
        raise SystemExit(
            "missing benchmark fixtures; run `python3 benchmarks/generate_fixtures.py` first:\n"
            f"  {joined}"
        )

def render_sifr_runner(spec: ProblemSpec) -> Path:
    algorithm = strip_sifr_main(spec.source_sifr.read_text(encoding="utf-8"))
    rendered = harness.render_sifr_runner(algorithm, spec.function, spec.runner)
    SIFR_GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    output = SIFR_GENERATED_DIR / f"{spec.problem_id}_runner.sifr"
    output.write_text(rendered, encoding="utf-8")
    return output

def render_nodejs_runner(spec: ProblemSpec) -> Path:
    if not spec.source_js.exists():
        raise RuntimeError(f"missing Node.js source for {spec.problem_id}: {spec.source_js}")
    rendered = nodejs_harness.render_nodejs_runner(spec.source_js, spec.function, spec.runner)
    NODEJS_GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    output = NODEJS_GENERATED_DIR / f"{spec.problem_id}_runner.js"
    output.write_text(rendered, encoding="utf-8")
    return output

def render_rust_runner(spec: ProblemSpec) -> Path:
    if not spec.source_rs.exists():
        raise RuntimeError(f"missing Rust source for {spec.problem_id}: {spec.source_rs}")
    rendered = rust_harness.render_rust_runner(spec.source_rs, spec.function, spec.runner)
    RUST_GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    output = RUST_GENERATED_DIR / f"{spec.problem_id}_runner.rs"
    output.write_text(rendered, encoding="utf-8")
    return output

def build_sifr_runner(spec: ProblemSpec) -> Path:
    runner_path = render_sifr_runner(spec)
    output_dir = BIN_DIR / "sifr" / spec.problem_id
    if output_dir.exists():
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    cmd = sifr_command(["build", str(runner_path), "-o", str(output_dir)])
    start = time.perf_counter()
    result = subprocess.run(cmd, cwd=REPO_ROOT, text=True, capture_output=True)
    elapsed = time.perf_counter() - start
    if result.returncode != 0:
        sys.stderr.write(result.stdout)
        sys.stderr.write(result.stderr)
        raise SystemExit(result.returncode)
    binary = default_sifr_binary(output_dir)
    if not binary.exists():
        candidates = executable_files(output_dir)
        if len(candidates) == 1:
            binary = candidates[0]
    if not binary.exists():
        raise RuntimeError(f"could not find compiled binary for {runner_path}")
    stable_binary = output_dir / f"{spec.problem_id}_sifr"
    shutil.copy2(binary, stable_binary)
    stable_binary.chmod(stable_binary.stat().st_mode | 0o111)
    print(f"built {spec.problem_id} in {elapsed:.2f}s: {stable_binary}")
    return stable_binary

def build_rust_runner(spec: ProblemSpec) -> Path:
    runner_path = render_rust_runner(spec)
    output_dir = BIN_DIR / "rust"
    output_dir.mkdir(parents=True, exist_ok=True)
    binary = output_dir / f"{spec.problem_id}_rust"
    cmd = ["rustc", "--edition=2021", "-O", str(runner_path), "-o", str(binary)]
    start = time.perf_counter()
    result = subprocess.run(cmd, cwd=REPO_ROOT, text=True, capture_output=True)
    elapsed = time.perf_counter() - start
    if result.returncode != 0:
        sys.stderr.write(result.stdout)
        sys.stderr.write(result.stderr)
        raise SystemExit(result.returncode)
    binary.chmod(binary.stat().st_mode | 0o111)
    print(f"built rust {spec.problem_id} in {elapsed:.2f}s: {binary}")
    return binary

def default_sifr_binary(output_dir: Path) -> Path:
    return output_dir / "sifr_output" / "target" / "release" / "sifr_output"

def executable_files(directory: Path) -> list[Path]:
    return sorted(
        path
        for path in directory.rglob("*")
        if path.is_file() and path.stat().st_mode & 0o111
    )

def sifr_command(args: list[str]) -> list[str]:
    env_bin = Path(value) if (value := os_environ_get("SIFR_BIN")) else None
    if env_bin is not None and env_bin.exists():
        return [str(env_bin), *args]
    release_bin = REPO_ROOT / "target" / "release" / "sifr"
    if release_bin.exists():
        return [str(release_bin), *args]
    debug_bin = REPO_ROOT / "target" / "debug" / "sifr"
    if debug_bin.exists():
        return [str(debug_bin), *args]
    return ["cargo", "run", "-q", "-p", "sifr", "--", *args]

def os_environ_get(key: str) -> str | None:
    import os

    return os.environ.get(key)

def run_python(spec: ProblemSpec, fixture_path: Path, expected_path: Path, loops: int) -> None:
    oracle = load_python_function(spec)
    fixture_text = fixture_path.read_text(encoding="utf-8")
    expected_text = expected_path.read_text(encoding="utf-8")
    print(harness.run_python(fixture_text, expected_text, oracle, loops, spec.runner))

def run_nodejs(runner_path: Path, fixture_path: Path, expected_path: Path, loops: int) -> None:
    cmd = nodejs_command([str(runner_path), str(fixture_path), str(expected_path), str(loops)])
    result = subprocess.run(cmd, cwd=REPO_ROOT, text=True, capture_output=True)
    if result.returncode != 0:
        sys.stderr.write(result.stdout)
        sys.stderr.write(result.stderr)
        raise SystemExit(result.returncode)
    print(result.stdout.strip())

def nodejs_command(args: list[str]) -> list[str]:
    node = shutil.which("node")
    if node is None:
        raise SystemExit("node is required for Node.js benchmarks")
    return [node, *args]

def run_correctness(
    spec: ProblemSpec,
    *,
    languages: set[str],
    binary: Path | None,
    nodejs_runner: Path | None,
    rust_binary: Path | None,
) -> None:
    for size in spec.sizes:
        fixture_path, expected_path = fixture_paths(spec, size)
        loops = 1
        if "python" in languages:
            run_python(spec, fixture_path, expected_path, loops)
        if "sifr" in languages:
            if binary is None:
                raise RuntimeError("Sifr binary is required for Sifr correctness")
            cmd = [str(binary), str(fixture_path), str(expected_path), str(loops)]
            result = subprocess.run(cmd, cwd=REPO_ROOT, text=True, capture_output=True)
            if result.returncode != 0:
                sys.stderr.write(result.stdout)
                sys.stderr.write(result.stderr)
                raise SystemExit(result.returncode)
        if "nodejs" in languages:
            if nodejs_runner is None:
                raise RuntimeError("Node.js runner is required for Node.js correctness")
            run_nodejs(nodejs_runner, fixture_path, expected_path, loops)
        if "rust" in languages:
            if rust_binary is None:
                raise RuntimeError("Rust binary is required for Rust correctness")
            result = subprocess.run(
                [str(rust_binary), str(fixture_path), str(expected_path), str(loops)],
                cwd=REPO_ROOT,
                text=True,
                capture_output=True,
            )
            if result.returncode != 0:
                sys.stderr.write(result.stdout)
                sys.stderr.write(result.stderr)
                raise SystemExit(result.returncode)
            print(result.stdout.strip())
    print(f"correctness passed: {spec.problem_id}")

def hyperfine_command(
    spec: ProblemSpec,
    size: int,
    *,
    languages: set[str],
    binary: Path | None,
    nodejs_runner: Path | None,
    rust_binary: Path | None,
    runs: int,
    warmup: int,
    result_path: Path | None = None,
    markdown_path: Path | None = None,
) -> list[str]:
    fixture_path, expected_path = fixture_paths(spec, size)
    loops = spec.loops_by_size[size]
    result_path = result_path or hyperfine_result_path(spec, size)
    markdown_path = markdown_path or hyperfine_markdown_path(spec, size)
    cmd = [
        "hyperfine",
        "--warmup",
        str(warmup),
        "--runs",
        str(runs),
        "--export-json",
        str(result_path),
        "--export-markdown",
        str(markdown_path),
    ]
    for language, command in benchmark_commands(
        spec,
        size,
        languages=languages,
        binary=binary,
        nodejs_runner=nodejs_runner,
        rust_binary=rust_binary,
    ).items():
        cmd.extend(["--command-name", f"{language}:{spec.problem_id}:{size}", shlex_join(command)])
    return cmd

def hyperfine_result_path(spec: ProblemSpec, size: int) -> Path:
    return RAW_RESULTS_DIR / f"{spec.problem_id}_{fixture_stem(spec, size)}.hyperfine.json"

def hyperfine_markdown_path(spec: ProblemSpec, size: int) -> Path:
    return RAW_RESULTS_DIR / f"{spec.problem_id}_{fixture_stem(spec, size)}.md"

def benchmark_commands(
    spec: ProblemSpec,
    size: int,
    *,
    languages: set[str],
    binary: Path | None,
    nodejs_runner: Path | None,
    rust_binary: Path | None,
) -> dict[str, list[str]]:
    fixture_path, expected_path = fixture_paths(spec, size)
    loops = spec.loops_by_size[size]
    commands: dict[str, list[str]] = {}
    if "python" in languages:
        commands["python"] = [
            sys.executable,
            str(BENCH_ROOT / "bench.py"),
            "run-python",
            spec.problem_id,
            str(fixture_path),
            str(expected_path),
            str(loops),
        ]
    if "sifr" in languages:
        if binary is None:
            raise RuntimeError("Sifr binary is required for Sifr benchmark command")
        commands["sifr"] = [str(binary), str(fixture_path), str(expected_path), str(loops)]
    if "nodejs" in languages:
        if nodejs_runner is None:
            raise RuntimeError("Node.js runner is required for Node.js benchmark command")
        commands["nodejs"] = nodejs_command([str(nodejs_runner), str(fixture_path), str(expected_path), str(loops)])
    if "rust" in languages:
        if rust_binary is None:
            raise RuntimeError("Rust binary is required for Rust benchmark command")
        commands["rust"] = [str(rust_binary), str(fixture_path), str(expected_path), str(loops)]
    return commands

def shlex_join(parts: list[str]) -> str:
    import shlex

    return shlex.join(parts)

def memory_result_path(spec: ProblemSpec, size: int) -> Path:
    return RAW_RESULTS_DIR / f"{spec.problem_id}_{fixture_stem(spec, size)}.memory.json"

def merge_measurements(existing: list[dict[str, Any]], new: list[dict[str, Any]]) -> list[dict[str, Any]]:
    merged = {measurement["impl"]: measurement for measurement in existing}
    for measurement in new:
        merged[measurement["impl"]] = measurement
    return list(merged.values())

def merge_hyperfine_results(existing_path: Path, new_path: Path) -> None:
    if not existing_path.exists():
        shutil.move(str(new_path), str(existing_path))
        return
    existing = json.loads(existing_path.read_text(encoding="utf-8"))
    new = json.loads(new_path.read_text(encoding="utf-8"))
    by_impl = {result["command"].split(":", 1)[0]: result for result in existing.get("results", [])}
    for result in new.get("results", []):
        by_impl[result["command"].split(":", 1)[0]] = result
    existing["results"] = list(by_impl.values())
    existing_path.write_text(json.dumps(existing, indent=2), encoding="utf-8")

def parse_time_memory(stderr: str) -> dict[str, int | None]:
    rss_match = re.search(r"(?m)^\s*(\d+)\s+maximum resident set size$", stderr)
    if rss_match:
        return {"rss_bytes": int(rss_match.group(1)), "peak_footprint_bytes": parse_peak_footprint(stderr)}

    gnu_match = re.search(r"Maximum resident set size \(kbytes\):\s*(\d+)", stderr)
    if gnu_match:
        return {"rss_bytes": int(gnu_match.group(1)) * 1024, "peak_footprint_bytes": None}

    raise RuntimeError("could not parse maximum resident set size from /usr/bin/time output")

def parse_peak_footprint(stderr: str) -> int | None:
    match = re.search(r"(?m)^\s*(\d+)\s+peak memory footprint$", stderr)
    return int(match.group(1)) if match else None

def measure_command_memory(command: list[str]) -> dict[str, int | None]:
    time_binary = "/usr/bin/time"
    if not Path(time_binary).exists():
        raise RuntimeError(f"{time_binary} is required for memory measurement")
    result = subprocess.run([time_binary, "-l", *command], cwd=REPO_ROOT, text=True, capture_output=True)
    if result.returncode == 0:
        return parse_time_memory(result.stderr)
    if "illegal option" not in result.stderr:
        sys.stderr.write(result.stdout)
        sys.stderr.write(result.stderr)
        raise SystemExit(result.returncode)

    linux_result = subprocess.run([time_binary, "-v", *command], cwd=REPO_ROOT, text=True, capture_output=True)
    if linux_result.returncode != 0:
        sys.stderr.write(result.stdout)
        sys.stderr.write(result.stderr)
        sys.stderr.write(linux_result.stdout)
        sys.stderr.write(linux_result.stderr)
        raise SystemExit(linux_result.returncode)
    return parse_time_memory(linux_result.stderr)

def run_memory_measurements(
    spec: ProblemSpec,
    size: int,
    *,
    languages: set[str],
    binary: Path | None,
    nodejs_runner: Path | None,
    rust_binary: Path | None,
    runs: int,
) -> None:
    RAW_RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    if runs <= 0:
        return
    measurements = []
    for impl, command in benchmark_commands(
        spec,
        size,
        languages=languages,
        binary=binary,
        nodejs_runner=nodejs_runner,
        rust_binary=rust_binary,
    ).items():
        rss_values = []
        footprint_values = []
        for _ in range(runs):
            memory = measure_command_memory(command)
            if memory["rss_bytes"] is not None:
                rss_values.append(memory["rss_bytes"])
            if memory["peak_footprint_bytes"] is not None:
                footprint_values.append(memory["peak_footprint_bytes"])
        measurements.append(
            {
                "impl": impl,
                "command": shlex_join(command),
                "rss_bytes": rss_values,
                "peak_footprint_bytes": footprint_values,
                "mean_rss_bytes": statistics.mean(rss_values) if rss_values else None,
                "peak_rss_bytes": max(rss_values) if rss_values else None,
            }
        )
    path = memory_result_path(spec, size)
    existing_measurements = []
    if path.exists():
        existing_data = json.loads(path.read_text(encoding="utf-8"))
        existing_measurements = existing_data.get("measurements", [])
    path.write_text(
        json.dumps(
            {
                "problem": spec.problem_id,
                "size": size,
                "runs": runs,
                "source": "/usr/bin/time",
                "measurements": merge_measurements(existing_measurements, measurements),
            },
            indent=2,
        ),
        encoding="utf-8",
    )

def run_hyperfine(
    spec: ProblemSpec,
    size: int,
    *,
    languages: set[str],
    binary: Path | None,
    nodejs_runner: Path | None,
    rust_binary: Path | None,
    runs: int,
    warmup: int,
) -> None:
    RAW_RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    result_path = hyperfine_result_path(spec, size)
    markdown_path = hyperfine_markdown_path(spec, size)
    temp_result_path = result_path.with_suffix(".tmp.hyperfine.json")
    temp_markdown_path = markdown_path.with_suffix(".tmp.md")
    cmd = hyperfine_command(
        spec,
        size,
        languages=languages,
        binary=binary,
        nodejs_runner=nodejs_runner,
        rust_binary=rust_binary,
        runs=runs,
        warmup=warmup,
        result_path=temp_result_path,
        markdown_path=temp_markdown_path,
    )
    print(" ".join(shlex_quote(part) for part in cmd))
    result = subprocess.run(cmd, cwd=REPO_ROOT, text=True)
    if result.returncode != 0:
        raise SystemExit(result.returncode)
    merge_hyperfine_results(result_path, temp_result_path)
    if temp_markdown_path.exists():
        shutil.move(str(temp_markdown_path), str(markdown_path))

def shlex_quote(value: str) -> str:
    import shlex

    return shlex.quote(value)

def print_summary(problem_ids: list[str]) -> None:
    report.print_summary(problem_ids, PROBLEMS, RAW_RESULTS_DIR)

def collect_environment() -> dict[str, Any]:
    try:
        sifr_version = subprocess.run(
            sifr_command(["--version"]),
            cwd=REPO_ROOT,
            text=True,
            capture_output=True,
            timeout=30,
        ).stdout.strip()
    except subprocess.SubprocessError:
        sifr_version = "unknown"
    try:
        node_version = subprocess.run(
            nodejs_command(["--version"]),
            cwd=REPO_ROOT,
            text=True,
            capture_output=True,
            timeout=30,
        ).stdout.strip()
    except (SystemExit, subprocess.SubprocessError):
        node_version = "unknown"
    try:
        rust_version = subprocess.run(
            ["rustc", "--version"],
            cwd=REPO_ROOT,
            text=True,
            capture_output=True,
            timeout=30,
        ).stdout.strip()
    except subprocess.SubprocessError:
        rust_version = "unknown"
    return {
        "python": sys.version.split()[0],
        "nodejs": node_version,
        "rust": rust_version,
        "platform": platform.platform(),
        "machine": platform.machine(),
        "processor": platform.processor(),
        "sifr": sifr_version,
        "problems": [
            {
                "id": spec.problem_id,
                "group": spec.group,
                "category": spec.category,
                "function": spec.function,
                "source_py": str(spec.source_py),
                "source_sifr": str(spec.source_sifr),
                "source_js": str(spec.source_js),
                "source_rs": str(spec.source_rs),
                "runner": spec.runner,
                "fixture_stem": spec.fixture_stem,
                "sizes": list(spec.sizes),
                "loops_by_size": spec.loops_by_size,
            }
            for spec in PROBLEMS.values()
        ],
    }

def write_environment() -> None:
    RAW_RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    path = RAW_RESULTS_DIR / "environment.json"
    path.write_text(json.dumps(collect_environment(), indent=2), encoding="utf-8")

def selected_specs(problem_ids: list[str]) -> list[ProblemSpec]:
    return select_problem_specs(PROBLEMS, problem_ids)

def ensure_hyperfine() -> None:
    if shutil.which("hyperfine") is None:
        raise SystemExit("hyperfine is required. Install it with `brew install hyperfine` or your package manager.")

def selected_languages(args: argparse.Namespace) -> set[str]:
    languages = set(args.language or DEFAULT_LANGUAGES)
    unknown = languages.difference(LANGUAGE_CHOICES)
    if unknown:
        raise SystemExit(f"unknown language(s): {', '.join(sorted(unknown))}")
    return languages

def command_build(args: argparse.Namespace) -> None:
    with benchmark_lock():
        languages = selected_languages(args)
        for spec in selected_specs(args.problem):
            if not spec.sizes:
                print(f"skipped {spec.problem_id}: no benchmark fixtures registered")
                continue
            if "sifr" in languages:
                build_sifr_runner(spec)
            if "nodejs" in languages:
                runner = render_nodejs_runner(spec)
                print(f"rendered {spec.problem_id}: {runner}")
            if "rust" in languages:
                build_rust_runner(spec)

def command_run(args: argparse.Namespace) -> None:
    with benchmark_lock():
        ensure_hyperfine()
        languages = selected_languages(args)
        write_environment()
        ensure_fixtures(args.problem)
        for spec in selected_specs(args.problem):
            if not spec.sizes:
                print(f"skipped {spec.problem_id}: no benchmark fixtures registered")
                continue
            binary = build_sifr_runner(spec) if "sifr" in languages else None
            nodejs_runner = render_nodejs_runner(spec) if "nodejs" in languages else None
            rust_binary = build_rust_runner(spec) if "rust" in languages else None
            run_correctness(
                spec,
                languages=languages,
                binary=binary,
                nodejs_runner=nodejs_runner,
                rust_binary=rust_binary,
            )
            for size in spec.sizes:
                run_hyperfine(
                    spec,
                    size,
                    languages=languages,
                    binary=binary,
                    nodejs_runner=nodejs_runner,
                    rust_binary=rust_binary,
                    runs=args.runs,
                    warmup=args.warmup,
                )
                run_memory_measurements(
                    spec,
                    size,
                    languages=languages,
                    binary=binary,
                    nodejs_runner=nodejs_runner,
                    rust_binary=rust_binary,
                    runs=args.memory_runs,
                )
        print_summary(args.problem)

def command_memory(args: argparse.Namespace) -> None:
    with benchmark_lock():
        languages = selected_languages(args)
        write_environment()
        ensure_fixtures(args.problem)
        for spec in selected_specs(args.problem):
            if not spec.sizes:
                print(f"skipped {spec.problem_id}: no benchmark fixtures registered")
                continue
            binary = build_sifr_runner(spec) if "sifr" in languages else None
            nodejs_runner = render_nodejs_runner(spec) if "nodejs" in languages else None
            rust_binary = build_rust_runner(spec) if "rust" in languages else None
            for size in spec.sizes:
                run_memory_measurements(
                    spec,
                    size,
                    languages=languages,
                    binary=binary,
                    nodejs_runner=nodejs_runner,
                    rust_binary=rust_binary,
                    runs=args.memory_runs,
                )
        print_summary(args.problem)

def command_run_python(args: argparse.Namespace) -> None:
    spec = PROBLEMS.get(args.problem)
    if spec is None:
        raise SystemExit(f"unknown problem: {args.problem}")
    run_python(spec, Path(args.fixture), Path(args.expected), args.loops)

def command_run_nodejs(args: argparse.Namespace) -> None:
    spec = PROBLEMS.get(args.problem)
    if spec is None:
        raise SystemExit(f"unknown problem: {args.problem}")
    runner_path = render_nodejs_runner(spec)
    run_nodejs(runner_path, Path(args.fixture), Path(args.expected), args.loops)

def command_summary(args: argparse.Namespace) -> None:
    print_summary(args.problem)

def command_report_html(args: argparse.Namespace) -> None:
    languages = set(args.language) if args.language else None
    report.render_html_report(args.problem, Path(args.output), PROBLEMS, RAW_RESULTS_DIR, languages)

def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="LeetCode benchmark orchestration")
    subparsers = parser.add_subparsers(required=True)

    build = subparsers.add_parser("build", help="prepare generated benchmark runners")
    build.add_argument("problem", nargs="*", help="problem ids to build")
    build.add_argument(
        "--language",
        action="append",
        choices=LANGUAGE_CHOICES,
        help="language to prepare; repeatable (default: python, sifr, nodejs, rust)",
    )
    build.set_defaults(func=command_build)

    run = subparsers.add_parser("run", help="build, verify, and benchmark existing fixtures")
    run.add_argument("problem", nargs="*", help="problem ids to benchmark")
    run.add_argument(
        "--language",
        action="append",
        choices=LANGUAGE_CHOICES,
        help="language to benchmark; repeatable (default: python, sifr, nodejs, rust)",
    )
    run.add_argument("--runs", type=int, default=20, help="hyperfine measured runs")
    run.add_argument("--warmup", type=int, default=3, help="hyperfine warmup runs")
    run.add_argument("--memory-runs", type=int, default=3, help="RSS measurement runs with /usr/bin/time")
    run.set_defaults(func=command_run)

    memory = subparsers.add_parser("memory", help="collect /usr/bin/time RSS measurements for existing fixtures")
    memory.add_argument("problem", nargs="*", help="problem ids to measure")
    memory.add_argument(
        "--language",
        action="append",
        choices=LANGUAGE_CHOICES,
        help="language to measure; repeatable (default: python, sifr, nodejs, rust)",
    )
    memory.add_argument("--memory-runs", type=int, default=3, help="RSS measurement runs with /usr/bin/time")
    memory.set_defaults(func=command_memory)

    run_python_parser = subparsers.add_parser("run-python", help=argparse.SUPPRESS)
    run_python_parser.add_argument("problem")
    run_python_parser.add_argument("fixture")
    run_python_parser.add_argument("expected")
    run_python_parser.add_argument("loops", type=int)
    run_python_parser.set_defaults(func=command_run_python)

    run_nodejs_parser = subparsers.add_parser("run-nodejs", help=argparse.SUPPRESS)
    run_nodejs_parser.add_argument("problem")
    run_nodejs_parser.add_argument("fixture")
    run_nodejs_parser.add_argument("expected")
    run_nodejs_parser.add_argument("loops", type=int)
    run_nodejs_parser.set_defaults(func=command_run_nodejs)

    summary = subparsers.add_parser("summary", help="summarize existing hyperfine output")
    summary.add_argument("problem", nargs="*", help="problem ids to summarize")
    summary.set_defaults(func=command_summary)

    report_html = subparsers.add_parser("report-html", help="write a static HTML benchmark report")
    report_html.add_argument("problem", nargs="*", help="problem ids to include")
    report_html.add_argument(
        "--language",
        action="append",
        choices=LANGUAGE_CHOICES,
        help="language to include in the report; repeatable (default: all result languages)",
    )
    report_html.add_argument(
        "-o",
        "--output",
        default=str(RESULTS_DIR / "report.html"),
        help="HTML output path",
    )
    report_html.set_defaults(func=command_report_html)
    return parser

def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()
