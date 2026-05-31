from __future__ import annotations

import ast
import copy
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
NODEJS_GENERATED_DIR = GENERATED_DIR / "nodejs"
RUST_GENERATED_DIR = GENERATED_DIR / "rust"
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
    source_js: Path
    source_rs: Path
    runner: dict[str, Any]
    fixture_stem: str
    sizes: tuple[int, ...]
    loops_by_size: dict[int, int]
    benchmark_status: str
    parity_status: str
    primary_slowness_owner: str
    slowness_tags: tuple[str, ...]

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
            source_py = root_path(item["source_py"])
            source_sifr = root_path(item["source_sifr"])
            spec = ProblemSpec(
                problem_id=item["id"],
                group=slug,
                category=item.get("category", category),
                function=item["function"],
                source_py=source_py,
                source_sifr=source_sifr,
                source_js=root_path(item.get("source_js", f"src/{item['id']}.js")),
                source_rs=root_path(item.get("source_rs", f"src/{item['id']}.rs")),
                runner=runner_with_inferred_copy_args(item["runner"], source_py, source_sifr, item["function"]),
                fixture_stem=item["fixture_stem"],
                sizes=tuple(int(size) for size in item["sizes"]),
                loops_by_size={int(size): int(loops) for size, loops in item["loops_by_size"].items()},
                benchmark_status=item.get("benchmark_status", "unknown"),
                parity_status=item.get("parity_status", "unknown"),
                primary_slowness_owner=item.get("primary_slowness_owner", "unknown"),
                slowness_tags=tuple(str(tag) for tag in item.get("slowness_tags", [])),
            )
            specs[spec.problem_id] = spec
    return specs

def runner_with_inferred_copy_args(
    runner: dict[str, Any],
    source_py: Path,
    source_sifr: Path,
    function: str,
) -> dict[str, Any]:
    normalized = copy.deepcopy(runner)
    call = normalized.get("call", {})
    if call.get("mode") != "single":
        return normalized
    copyable = copyable_call_args(normalized)
    inferred = [
        name for name in (
            mutating_sifr_container_args(source_sifr, function, call.get("args", []))
            + mutating_python_container_args(source_py, function, call)
        )
        if name in copyable
    ]
    if not inferred:
        return normalized
    copy_args = list(call.get("copy_args", []))
    for name in inferred:
        if name not in copy_args:
            copy_args.append(name)
    call["copy_args"] = copy_args
    return normalized

def copyable_call_args(runner: dict[str, Any]) -> set[str]:
    return {
        binding["name"]
        for binding in runner.get("input", {}).get("bindings", [])
        if binding.get("type") in {"list[int]", "list[str]", "list[float]", "matrix[int]", "matrix[str]"}
    }

def mutating_sifr_container_args(source_sifr: Path, function: str, call_args: list[str]) -> list[str]:
    if not source_sifr.exists():
        return []
    match = re.search(rf"def\s+{re.escape(function)}\s*\(([^)]*)\)", source_sifr.read_text(encoding="utf-8"))
    if match is None:
        return []
    inferred = []
    for index, raw_param in enumerate(match.group(1).split(",")):
        if ":" not in raw_param:
            continue
        left, right = raw_param.split(":", 1)
        tokens = left.split()
        if "mut" not in tokens or not right.strip().startswith(("list[", "matrix[", "dict[")):
            continue
        inferred.append(call_args[index] if index < len(call_args) else tokens[-1])
    return inferred

def mutating_python_container_args(source_py: Path, function: str, call: dict[str, Any]) -> list[str]:
    if not source_py.exists():
        return []
    tree = ast.parse(source_py.read_text(encoding="utf-8"))
    functions = [node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == function]
    if not functions:
        return []
    params = [arg.arg for arg in functions[-1].args.args]
    if call.get("python_self") and params:
        params = params[1:]
    call_args = call.get("args", [])
    param_to_call = {param: call_args[index] for index, param in enumerate(params[: len(call_args)])}
    visitor = PythonMutationVisitor(set(param_to_call))
    visitor.visit(functions[-1])
    return [param_to_call[param] for param in params if param in visitor.mutated and param in param_to_call]

class PythonMutationVisitor(ast.NodeVisitor):
    MUTATING_METHODS = {"append", "clear", "extend", "insert", "pop", "remove", "reverse", "sort"}

    def __init__(self, params: set[str]) -> None:
        self.aliases = {name: name for name in params}
        self.mutated: set[str] = set()

    def visit_Assign(self, node: ast.Assign) -> None:
        value_root = self.root_name(node.value)
        for target in node.targets:
            self.record_target_mutation(target)
            if isinstance(target, ast.Name) and value_root in self.aliases:
                self.aliases[target.id] = self.aliases[value_root]
        self.generic_visit(node)

    def visit_AnnAssign(self, node: ast.AnnAssign) -> None:
        self.record_target_mutation(node.target)
        value_root = self.root_name(node.value)
        if isinstance(node.target, ast.Name) and value_root in self.aliases:
            self.aliases[node.target.id] = self.aliases[value_root]
        self.generic_visit(node)

    def visit_AugAssign(self, node: ast.AugAssign) -> None:
        self.record_target_mutation(node.target)
        self.generic_visit(node)

    def visit_Delete(self, node: ast.Delete) -> None:
        for target in node.targets:
            self.record_target_mutation(target)
        self.generic_visit(node)

    def visit_Call(self, node: ast.Call) -> None:
        if isinstance(node.func, ast.Attribute) and node.func.attr in self.MUTATING_METHODS:
            root = self.root_name(node.func.value)
            if root in self.aliases:
                self.mutated.add(self.aliases[root])
        self.generic_visit(node)

    def record_target_mutation(self, target: ast.AST) -> None:
        if isinstance(target, (ast.Subscript, ast.Attribute)):
            root = self.root_name(target)
            if root in self.aliases:
                self.mutated.add(self.aliases[root])

    def root_name(self, node: ast.AST | None) -> str | None:
        while isinstance(node, (ast.Subscript, ast.Attribute)):
            node = node.value
        return node.id if isinstance(node, ast.Name) else None

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
