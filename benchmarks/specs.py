from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any


BENCH_ROOT = Path(__file__).resolve().parent
REPO_ROOT = BENCH_ROOT.parents[2]
FIXTURES_DIR = BENCH_ROOT / "fixtures"
GENERATED_DIR = BENCH_ROOT / "generated"
RESULTS_DIR = BENCH_ROOT / "results"
RAW_RESULTS_DIR = RESULTS_DIR / ".raw"
SIFR_GENERATED_DIR = GENERATED_DIR / "sifr"
BIN_DIR = GENERATED_DIR / "bin"
PROBLEMS_DIR = BENCH_ROOT / "problems"


@dataclass(frozen=True)
class ProblemSpec:
    problem_id: str
    group: str
    category: str
    function: str
    source_py: Path
    source_sifr: Path
    runner: dict[str, Any]
    fixture_stem: str
    sizes: tuple[int, ...]
    loops_by_size: dict[int, int]


def root_path(relative: str) -> Path:
    return BENCH_ROOT.parent / relative


def category_slug(category: str) -> str:
    text = category.lower()
    text = text.replace("&", " and ")
    return re.sub(r"[^a-z0-9]+", "_", text).strip("_")


def load_problem_groups() -> list[dict[str, Any]]:
    groups = []
    for path in PROBLEMS_DIR.glob("*.json"):
        raw = json.loads(path.read_text(encoding="utf-8"))
        raw["_path"] = path
        groups.append(raw)
    return sorted(groups, key=lambda group: (int(group.get("order", 0)), group["_path"].name))


def load_problem_specs() -> dict[str, ProblemSpec]:
    specs = {}
    for group in load_problem_groups():
        category = group["category"]
        slug = group.get("slug") or category_slug(category)
        for item in group["problems"]:
            spec = ProblemSpec(
                problem_id=item["id"],
                group=slug,
                category=item.get("category", category),
                function=item["function"],
                source_py=root_path(item["source_py"]),
                source_sifr=root_path(item["source_sifr"]),
                runner=item["runner"],
                fixture_stem=item["fixture_stem"],
                sizes=tuple(int(size) for size in item["sizes"]),
                loops_by_size={int(size): int(loops) for size, loops in item["loops_by_size"].items()},
            )
            specs[spec.problem_id] = spec
    return specs


def selected_specs(specs: dict[str, ProblemSpec], problem_ids: list[str]) -> list[ProblemSpec]:
    if not problem_ids:
        return list(specs.values())
    selected = []
    for problem_id in problem_ids:
        if problem_id not in specs:
            raise SystemExit(f"unknown problem: {problem_id}")
        selected.append(specs[problem_id])
    return selected


def fixture_stem(spec: ProblemSpec, size: int) -> str:
    return spec.fixture_stem.format(size=size)


def fixture_paths(spec: ProblemSpec, size: int) -> tuple[Path, Path]:
    base = FIXTURES_DIR / spec.problem_id / fixture_stem(spec, size)
    return base.with_suffix(".input"), base.with_suffix(".expected")
