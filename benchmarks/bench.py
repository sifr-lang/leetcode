#!/usr/bin/env python3
from __future__ import annotations

import argparse
import importlib.util
import json
import platform
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

import report
from specs import (
    BIN_DIR,
    HARNESSES_DIR,
    RAW_RESULTS_DIR,
    REPO_ROOT,
    RESULTS_DIR,
    SIFR_GENERATED_DIR,
    TEMPLATE_PATH,
    ProblemSpec,
    fixture_paths,
    fixture_stem,
    load_problem_specs,
    selected_specs as select_problem_specs,
)

sys.dont_write_bytecode = True

BENCH_ROOT = Path(__file__).resolve().parent
PROBLEMS = load_problem_specs()


def load_python_function(spec: ProblemSpec) -> Any:
    module_name = f"leetcode_bench_{spec.problem_id}"
    module_spec = importlib.util.spec_from_file_location(module_name, spec.source_py)
    if module_spec is None or module_spec.loader is None:
        raise RuntimeError(f"could not load {spec.source_py}")
    module = importlib.util.module_from_spec(module_spec)
    module_spec.loader.exec_module(module)
    return getattr(module, spec.function)


def load_harness(spec: ProblemSpec) -> Any:
    harness_path = HARNESSES_DIR / f"{spec.harness}.py"
    if not harness_path.exists():
        raise RuntimeError(f"missing benchmark harness: {harness_path}")
    module_name = f"leetcode_bench_harness_{spec.harness}"
    module_spec = importlib.util.spec_from_file_location(module_name, harness_path)
    if module_spec is None or module_spec.loader is None:
        raise RuntimeError(f"could not load {harness_path}")
    module = importlib.util.module_from_spec(module_spec)
    module_spec.loader.exec_module(module)
    for function_name in ("run_python", "sifr_runner_body"):
        if not hasattr(module, function_name):
            raise RuntimeError(f"{harness_path} must define {function_name}")
    return module


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
    body = load_harness(spec).sifr_runner_body(spec.function)
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    rendered = template.replace("{{ALGORITHM}}", algorithm.rstrip())
    rendered = rendered.replace("{{RUNNER_BODY}}", body)
    SIFR_GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    output = SIFR_GENERATED_DIR / f"{spec.problem_id}_runner.sifr"
    output.write_text(rendered.rstrip() + "\n", encoding="utf-8")
    return output


def build_sifr_runner(spec: ProblemSpec) -> Path:
    runner_path = render_sifr_runner(spec)
    BIN_DIR.mkdir(parents=True, exist_ok=True)
    cmd = sifr_command(["build", str(runner_path), "-o", str(BIN_DIR)])
    start = time.perf_counter()
    result = subprocess.run(cmd, cwd=REPO_ROOT, text=True, capture_output=True)
    elapsed = time.perf_counter() - start
    if result.returncode != 0:
        sys.stderr.write(result.stdout)
        sys.stderr.write(result.stderr)
        raise SystemExit(result.returncode)
    binary = parse_compiled_binary(result.stderr) or (BIN_DIR / "main")
    if not binary.exists():
        candidates = sorted(path for path in BIN_DIR.iterdir() if path.is_file() and path.stat().st_mode & 0o111)
        if len(candidates) == 1:
            binary = candidates[0]
    if not binary.exists():
        raise RuntimeError(f"could not find compiled binary for {runner_path}")
    print(f"built {spec.problem_id} in {elapsed:.2f}s: {binary}")
    return binary


def parse_compiled_binary(stderr: str) -> Path | None:
    match = re.search(r"compiled successfully:\s+(.+)", stderr)
    if not match:
        return None
    return Path(match.group(1).strip())


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
    harness = load_harness(spec)
    fixture_text = fixture_path.read_text(encoding="utf-8")
    expected_text = expected_path.read_text(encoding="utf-8")
    print(harness.run_python(fixture_text, expected_text, oracle, loops))


def run_correctness(spec: ProblemSpec, binary: Path) -> None:
    for size in spec.sizes:
        fixture_path, expected_path = fixture_paths(spec, size)
        loops = 1
        run_python(spec, fixture_path, expected_path, loops)
        cmd = [str(binary), str(fixture_path), str(expected_path), str(loops)]
        result = subprocess.run(cmd, cwd=REPO_ROOT, text=True, capture_output=True)
        if result.returncode != 0:
            sys.stderr.write(result.stdout)
            sys.stderr.write(result.stderr)
            raise SystemExit(result.returncode)
    print(f"correctness passed: {spec.problem_id}")


def hyperfine_command(
    spec: ProblemSpec,
    binary: Path,
    size: int,
    *,
    runs: int,
    warmup: int,
) -> list[str]:
    fixture_path, expected_path = fixture_paths(spec, size)
    loops = spec.loops_by_size[size]
    result_path = RAW_RESULTS_DIR / f"{spec.problem_id}_{fixture_stem(spec, size)}.hyperfine.json"
    markdown_path = RAW_RESULTS_DIR / f"{spec.problem_id}_{fixture_stem(spec, size)}.md"
    python_cmd = (
        f"{shlex_join([sys.executable, str(BENCH_ROOT / 'bench.py'), 'run-python', spec.problem_id, str(fixture_path), str(expected_path), str(loops)])}"
    )
    sifr_cmd = shlex_join([str(binary), str(fixture_path), str(expected_path), str(loops)])
    return [
        "hyperfine",
        "--warmup",
        str(warmup),
        "--runs",
        str(runs),
        "--export-json",
        str(result_path),
        "--export-markdown",
        str(markdown_path),
        "--command-name",
        f"python:{spec.problem_id}:{size}",
        python_cmd,
        "--command-name",
        f"sifr:{spec.problem_id}:{size}",
        sifr_cmd,
    ]


def shlex_join(parts: list[str]) -> str:
    import shlex

    return shlex.join(parts)


def run_hyperfine(spec: ProblemSpec, binary: Path, size: int, *, runs: int, warmup: int) -> None:
    RAW_RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    cmd = hyperfine_command(spec, binary, size, runs=runs, warmup=warmup)
    print(" ".join(shlex_quote(part) for part in cmd))
    result = subprocess.run(cmd, cwd=REPO_ROOT, text=True)
    if result.returncode != 0:
        raise SystemExit(result.returncode)


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
    return {
        "python": sys.version.split()[0],
        "platform": platform.platform(),
        "machine": platform.machine(),
        "processor": platform.processor(),
        "sifr": sifr_version,
        "problems": [
            {
                "id": spec.problem_id,
                "category": spec.category,
                "function": spec.function,
                "source_py": str(spec.source_py),
                "source_sifr": str(spec.source_sifr),
                "harness": spec.harness,
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


def command_build(args: argparse.Namespace) -> None:
    for spec in selected_specs(args.problem):
        build_sifr_runner(spec)


def command_run(args: argparse.Namespace) -> None:
    ensure_hyperfine()
    write_environment()
    ensure_fixtures(args.problem)
    for spec in selected_specs(args.problem):
        binary = build_sifr_runner(spec)
        run_correctness(spec, binary)
        for size in spec.sizes:
            run_hyperfine(spec, binary, size, runs=args.runs, warmup=args.warmup)
    print_summary(args.problem)


def command_run_python(args: argparse.Namespace) -> None:
    spec = PROBLEMS.get(args.problem)
    if spec is None:
        raise SystemExit(f"unknown problem: {args.problem}")
    run_python(spec, Path(args.fixture), Path(args.expected), args.loops)


def command_summary(args: argparse.Namespace) -> None:
    print_summary(args.problem)


def command_report_html(args: argparse.Namespace) -> None:
    report.render_html_report(args.problem, Path(args.output), PROBLEMS, RAW_RESULTS_DIR)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="LeetCode benchmark orchestration")
    subparsers = parser.add_subparsers(required=True)

    build = subparsers.add_parser("build", help="build generated Sifr runners")
    build.add_argument("problem", nargs="*", help="problem ids to build")
    build.set_defaults(func=command_build)

    run = subparsers.add_parser("run", help="build, verify, and benchmark existing fixtures")
    run.add_argument("problem", nargs="*", help="problem ids to benchmark")
    run.add_argument("--runs", type=int, default=20, help="hyperfine measured runs")
    run.add_argument("--warmup", type=int, default=3, help="hyperfine warmup runs")
    run.set_defaults(func=command_run)

    run_python_parser = subparsers.add_parser("run-python", help=argparse.SUPPRESS)
    run_python_parser.add_argument("problem")
    run_python_parser.add_argument("fixture")
    run_python_parser.add_argument("expected")
    run_python_parser.add_argument("loops", type=int)
    run_python_parser.set_defaults(func=command_run_python)

    summary = subparsers.add_parser("summary", help="summarize existing hyperfine output")
    summary.add_argument("problem", nargs="*", help="problem ids to summarize")
    summary.set_defaults(func=command_summary)

    report_html = subparsers.add_parser("report-html", help="write a static HTML benchmark report")
    report_html.add_argument("problem", nargs="*", help="problem ids to include")
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
