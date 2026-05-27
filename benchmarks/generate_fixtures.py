#!/usr/bin/env python3
from __future__ import annotations

import argparse
import importlib.util
import sys
from typing import Any

from harnesses import generic as harness
from specs import (
    BENCH_ROOT,
    ProblemSpec,
    fixture_paths,
    fixture_stem,
    load_problem_specs,
    selected_specs,
)


sys.dont_write_bytecode = True
PROBLEMS = load_problem_specs()


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


def load_problem_cases(spec: ProblemSpec) -> Any:
    cases_path = BENCH_ROOT / "cases" / spec.group / f"{spec.problem_id}.py"
    if not cases_path.exists():
        raise RuntimeError(f"missing fixture generator: {cases_path}")
    module_name = f"leetcode_bench_cases_{spec.problem_id}"
    module_spec = importlib.util.spec_from_file_location(module_name, cases_path)
    if module_spec is None or module_spec.loader is None:
        raise RuntimeError(f"could not load {cases_path}")
    module = importlib.util.module_from_spec(module_spec)
    module_spec.loader.exec_module(module)
    for function_name in ("fixture_stem", "generate_input"):
        if not hasattr(module, function_name):
            raise RuntimeError(f"{cases_path} must define {function_name}")
    return module


def normalize_text(value: Any, key: str) -> str:
    if not isinstance(value, str):
        raise RuntimeError(f"fixture payload {key!r} must be a string")
    if value.endswith("\n"):
        return value
    return value + "\n"


def generate_fixture(spec: ProblemSpec, size: int) -> None:
    oracle = load_python_function(spec)
    cases = load_problem_cases(spec)
    stem = cases.fixture_stem(size)
    expected_stem = fixture_stem(spec, size)
    if stem != expected_stem:
        raise RuntimeError(f"{spec.problem_id} size {size} returned stem {stem!r}, expected {expected_stem!r}")
    input_text = normalize_text(cases.generate_input(size), "input")
    expected_text = normalize_text(harness.solve_expected(input_text, oracle, spec.runner), "expected")
    fixture_path, expected_path = fixture_paths(spec, size)
    fixture_path.parent.mkdir(parents=True, exist_ok=True)
    fixture_path.write_text(input_text, encoding="utf-8")
    expected_path.write_text(expected_text, encoding="utf-8")


def generate_fixtures(problem_ids: list[str]) -> None:
    for spec in selected_specs(PROBLEMS, problem_ids):
        for size in spec.sizes:
            generate_fixture(spec, size)
            print(f"generated {spec.problem_id} {fixture_stem(spec, size)}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate deterministic LeetCode benchmark fixtures")
    parser.add_argument("problem", nargs="*", help="problem ids to generate")
    args = parser.parse_args()
    generate_fixtures(args.problem)


if __name__ == "__main__":
    main()
