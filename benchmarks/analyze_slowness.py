#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import math
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from failed_inventory import build_inventory, failure_excerpt, validate_details
from slowness_seed import FAILED_SEED, SLOWNESS_SEED, seed_metadata
from specs import RAW_RESULTS_DIR, ProblemSpec, fixture_stem, load_problem_groups, load_problem_specs

START_MARKER = "<!-- analyze_slowness:start -->"
END_MARKER = "<!-- analyze_slowness:end -->"
VALID_BENCHMARK_STATUS = {"complete", "partial", "failed_build", "failed_correctness", "failed_timeout"}
VALID_PARITY_STATUS = {"equivalent", "known_divergent", "unknown", "failed_correctness"}
VALID_OWNER = {"compiler", "leetcode_sifr_code", "mixed", "noise", "unknown"}
METADATA_KEYS = ("benchmark_status", "parity_status", "primary_slowness_owner", "slowness_tags")


@dataclass
class FixtureMeasurement:
    size: int
    has_pair: bool
    ratio: float | None = None
    problem_path: Path | None = None
    missing_reason: str | None = None


@dataclass
class ProblemAnalysis:
    spec: ProblemSpec
    fixtures: list[FixtureMeasurement] = field(default_factory=list)

    @property
    def complete_pair_count(self) -> int:
        return sum(1 for fixture in self.fixtures if fixture.has_pair)

    @property
    def is_complete(self) -> bool:
        return self.complete_pair_count == len(self.spec.sizes)

    @property
    def is_partial(self) -> bool:
        return 0 < self.complete_pair_count < len(self.spec.sizes)

    @property
    def has_no_pair(self) -> bool:
        return self.complete_pair_count == 0

    @property
    def slower_fixtures(self) -> list[FixtureMeasurement]:
        return [
            fixture
            for fixture in self.fixtures
            if fixture.ratio is not None and fixture.ratio < 1.0
        ]

    @property
    def worst_ratio(self) -> float | None:
        ratios = [fixture.ratio for fixture in self.slower_fixtures if fixture.ratio is not None]
        return min(ratios) if ratios else None


def command_impl(command: str) -> str:
    return command.split(":", 1)[0]


def load_hyperfine_pair(path: Path) -> tuple[bool, float | None, str | None]:
    data = json.loads(path.read_text(encoding="utf-8"))
    means = {
        command_impl(result["command"]): float(result.get("mean") or 0.0)
        for result in data.get("results", [])
    }
    if "python" not in means or "sifr" not in means:
        return False, None, "missing python or sifr row"
    if means["sifr"] <= 0:
        return True, math.inf, None
    return True, means["python"] / means["sifr"], None


def analyze_problem(spec: ProblemSpec, raw_dir: Path) -> ProblemAnalysis:
    analysis = ProblemAnalysis(spec=spec)
    for size in spec.sizes:
        path = raw_dir / f"{spec.problem_id}_{fixture_stem(spec, size)}.hyperfine.json"
        if not path.exists():
            analysis.fixtures.append(
                FixtureMeasurement(size=size, has_pair=False, problem_path=path, missing_reason="missing result file")
            )
            continue
        has_pair, ratio, missing_reason = load_hyperfine_pair(path)
        analysis.fixtures.append(
            FixtureMeasurement(size=size, has_pair=has_pair, ratio=ratio, problem_path=path, missing_reason=missing_reason)
        )
    return analysis


def analyze_all(specs: dict[str, ProblemSpec], raw_dir: Path) -> list[ProblemAnalysis]:
    return [analyze_problem(spec, raw_dir) for spec in specs.values()]


def format_ratio(ratio: float | None) -> str:
    if ratio is None:
        return "n/a"
    if math.isinf(ratio):
        return "inf"
    return f"{ratio:.3f}".rstrip("0").rstrip(".") + "x"


def metadata_for(problem_id: str) -> dict[str, Any]:
    return seed_metadata(problem_id) or {
        "benchmark_status": "complete",
        "parity_status": "unknown",
        "primary_slowness_owner": "unknown",
        "slowness_tags": [],
    }


def summary_counts(analyses: list[ProblemAnalysis]) -> dict[str, int]:
    return {
        "problems": len(analyses),
        "complete_problems": sum(1 for analysis in analyses if analysis.is_complete),
        "partial_problems": sum(1 for analysis in analyses if analysis.is_partial),
        "no_pair_problems": sum(1 for analysis in analyses if analysis.has_no_pair),
        "complete_fixture_pairs": sum(analysis.complete_pair_count for analysis in analyses),
        "measured_slower_problems": sum(1 for analysis in analyses if analysis.slower_fixtures),
    }


def markdown_table(rows: list[list[str]]) -> str:
    if not rows:
        return "_None._"
    header = rows[0]
    output = ["| " + " | ".join(header) + " |", "| " + " | ".join("---" for _ in header) + " |"]
    output.extend("| " + " | ".join(row) + " |" for row in rows[1:])
    return "\n".join(output)


def render_markdown(analyses: list[ProblemAnalysis], raw_dir: Path) -> str:
    counts = summary_counts(analyses)
    slower = sorted(
        (analysis for analysis in analyses if analysis.slower_fixtures),
        key=lambda analysis: (analysis.worst_ratio if analysis.worst_ratio is not None else math.inf, analysis.spec.problem_id),
    )
    partial = sorted((analysis for analysis in analyses if analysis.is_partial), key=lambda item: item.spec.problem_id)
    no_pair = sorted((analysis for analysis in analyses if analysis.has_no_pair), key=lambda item: item.spec.problem_id)

    slower_rows = [["Problem", "Category", "Worst Py/Sifr", "Slower sizes", "Owner", "Parity", "Tags"]]
    for analysis in slower:
        metadata = metadata_for(analysis.spec.problem_id)
        sizes = ", ".join(str(fixture.size) for fixture in analysis.slower_fixtures)
        slower_rows.append(
            [
                f"`{analysis.spec.problem_id}`",
                analysis.spec.category,
                format_ratio(analysis.worst_ratio),
                sizes,
                str(metadata["primary_slowness_owner"]),
                str(metadata["parity_status"]),
                ", ".join(metadata["slowness_tags"]),
            ]
        )

    partial_rows = [["Problem", "Complete pairs", "Missing sizes", "Status"]]
    for analysis in partial:
        missing = ", ".join(str(fixture.size) for fixture in analysis.fixtures if not fixture.has_pair)
        partial_rows.append([f"`{analysis.spec.problem_id}`", str(analysis.complete_pair_count), missing, "partial"])

    failed_rows = [["Problem", "Status", "Failure excerpt"]]
    for analysis in no_pair:
        metadata = metadata_for(analysis.spec.problem_id)
        failed_rows.append(
            [
                f"`{analysis.spec.problem_id}`",
                str(metadata["benchmark_status"]),
                failure_excerpt(analysis.spec.problem_id, raw_dir).replace("|", "\\|"),
            ]
        )

    return "\n\n".join(
        [
            "## Generated Analyzer Snapshot",
            "<!-- This section is generated by audits/leetcode/benchmarks/analyze_slowness.py. -->",
            "### Summary",
            markdown_table(
                [
                    ["Metric", "Count"],
                    ["Registry problems", str(counts["problems"])],
                    ["Fully complete problems", str(counts["complete_problems"])],
                    ["Complete fixture pairs", str(counts["complete_fixture_pairs"])],
                    ["Measured-slower problems", str(counts["measured_slower_problems"])],
                    ["Partial benchmark problems", str(counts["partial_problems"])],
                    ["No-pair failed problems", str(counts["no_pair_problems"])],
                ]
            ),
            "### Measured-Slower Problems",
            markdown_table(slower_rows),
            "### Partial Benchmarks",
            markdown_table(partial_rows),
            "### No-Pair Failures",
            markdown_table(failed_rows),
        ]
    )


def write_markdown(path: Path, markdown: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    wrapped = f"{START_MARKER}\n{markdown}\n{END_MARKER}\n"
    if not path.exists():
        path.write_text(wrapped, encoding="utf-8")
        return
    existing = path.read_text(encoding="utf-8")
    if START_MARKER in existing and END_MARKER in existing:
        before = existing.split(START_MARKER, 1)[0].rstrip()
        after = existing.split(END_MARKER, 1)[1].lstrip()
        path.write_text(f"{before}\n\n{wrapped}\n{after}".rstrip() + "\n", encoding="utf-8")
    else:
        path.write_text(existing.rstrip() + "\n\n" + wrapped, encoding="utf-8")


def merged_seed(problem_id: str, observed_status: str) -> dict[str, Any] | None:
    seed = seed_metadata(problem_id)
    if seed is None:
        return None
    result = dict(seed)
    if observed_status == "partial":
        result["benchmark_status"] = "partial"
    elif observed_status == "complete" and result.get("benchmark_status") == "partial":
        result["benchmark_status"] = "complete"
    result.setdefault("parity_status", "unknown")
    result.setdefault("primary_slowness_owner", "unknown")
    result.setdefault("slowness_tags", [])
    return result


def observed_status(analysis: ProblemAnalysis) -> str:
    if analysis.is_complete:
        return "complete"
    if analysis.is_partial:
        return "partial"
    metadata = seed_metadata(analysis.spec.problem_id) or {}
    return str(metadata.get("benchmark_status", "failed_build"))


def find_json_value_end(text: str, start: int) -> int:
    index = start
    while index < len(text) and text[index].isspace():
        index += 1
    opener = text[index]
    if opener not in "{[":
        while index < len(text) and text[index] not in ",\n":
            index += 1
        return index

    closer = "}" if opener == "{" else "]"
    depth = 0
    in_string = False
    escaped = False
    while index < len(text):
        char = text[index]
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
        elif char == '"':
            in_string = True
        elif char == opener:
            depth += 1
        elif char == closer:
            depth -= 1
            if depth == 0:
                return index + 1
        index += 1
    raise ValueError("unterminated JSON value")


def find_object_end(text: str, start: int) -> int:
    depth = 0
    in_string = False
    escaped = False
    index = start
    while index < len(text):
        char = text[index]
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
        elif char == '"':
            in_string = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return index + 1
        index += 1
    raise ValueError("unterminated JSON object")


def remove_metadata_fields(problem_text: str) -> str:
    changed = True
    while changed:
        changed = False
        for key in METADATA_KEYS:
            field_start = problem_text.find(f'\n      "{key}":')
            if field_start == -1:
                continue
            comma_start = field_start - 1 if field_start > 0 and problem_text[field_start - 1] == "," else field_start
            colon = problem_text.find(":", field_start)
            value_end = find_json_value_end(problem_text, colon + 1)
            problem_text = problem_text[:comma_start] + problem_text[value_end:]
            changed = True
    return problem_text


def metadata_block(metadata: dict[str, Any]) -> str:
    tags = metadata["slowness_tags"]
    if tags:
        tag_lines = ",\n".join(f'        "{tag}"' for tag in tags)
        tags_json = f"[\n{tag_lines}\n      ]"
    else:
        tags_json = "[]"
    return (
        f',\n      "benchmark_status": "{metadata["benchmark_status"]}",'
        f'\n      "parity_status": "{metadata["parity_status"]}",'
        f'\n      "primary_slowness_owner": "{metadata["primary_slowness_owner"]}",'
        f'\n      "slowness_tags": {tags_json}'
    )


def upsert_problem_metadata(source: str, problem_id: str, metadata: dict[str, Any]) -> str:
    id_pos = source.find(f'"id": "{problem_id}"')
    if id_pos == -1:
        raise ValueError(f"problem id not found in registry text: {problem_id}")
    object_start = source.rfind("\n    {", 0, id_pos)
    if object_start == -1:
        raise ValueError(f"problem object start not found: {problem_id}")
    object_start += 5
    object_end = find_object_end(source, object_start)
    problem_text = remove_metadata_fields(source[object_start:object_end])
    loops_pos = problem_text.find('"loops_by_size"')
    if loops_pos == -1:
        raise ValueError(f"loops_by_size not found for {problem_id}")
    colon = problem_text.find(":", loops_pos)
    value_end = find_json_value_end(problem_text, colon + 1)
    problem_text = problem_text[:value_end] + metadata_block(metadata) + problem_text[value_end:]
    return source[:object_start] + problem_text + source[object_end:]


def write_registry_metadata(analyses: list[ProblemAnalysis]) -> None:
    metadata_by_problem = {
        analysis.spec.problem_id: merged_seed(analysis.spec.problem_id, observed_status(analysis))
        for analysis in analyses
    }
    for group in load_problem_groups():
        path = group.pop("_path")
        source = path.read_text(encoding="utf-8")
        for item in group["problems"]:
            metadata = metadata_by_problem.get(item["id"])
            if metadata is None:
                continue
            source = upsert_problem_metadata(source, item["id"], metadata)
        path.write_text(source, encoding="utf-8")


def validate_metadata(analyses: list[ProblemAnalysis]) -> list[str]:
    diagnostics: list[str] = []
    slower_ids = {analysis.spec.problem_id for analysis in analyses if analysis.slower_fixtures}
    incomplete_ids = {
        analysis.spec.problem_id
        for analysis in analyses
        if analysis.is_partial or analysis.has_no_pair
    }
    missing_slower = sorted(slower_ids - set(SLOWNESS_SEED))
    missing_failed = sorted(incomplete_ids - set(FAILED_SEED) - set(SLOWNESS_SEED))
    if missing_slower:
        diagnostics.append(f"missing slowness seed metadata: {', '.join(missing_slower)}")
    if missing_failed:
        diagnostics.append(f"missing failed/partial seed metadata: {', '.join(missing_failed)}")
    diagnostics.extend(validate_details())
    for analysis in analyses:
        spec = analysis.spec
        if spec.benchmark_status not in VALID_BENCHMARK_STATUS | {"unknown"}:
            diagnostics.append(f"{spec.problem_id}: invalid benchmark_status {spec.benchmark_status!r}")
        if spec.parity_status not in VALID_PARITY_STATUS:
            diagnostics.append(f"{spec.problem_id}: invalid parity_status {spec.parity_status!r}")
        if spec.primary_slowness_owner not in VALID_OWNER:
            diagnostics.append(f"{spec.problem_id}: invalid primary_slowness_owner {spec.primary_slowness_owner!r}")
        if not isinstance(spec.slowness_tags, tuple):
            diagnostics.append(f"{spec.problem_id}: slowness_tags must be a list in registry JSON")
    return diagnostics


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Analyze Sifr/Python LeetCode benchmark slowness")
    parser.add_argument("--raw-dir", type=Path, default=RAW_RESULTS_DIR, help="directory containing raw benchmark exports")
    parser.add_argument("--output", type=Path, help="write or update a markdown analyzer snapshot")
    parser.add_argument("--failed-json", type=Path, help="write failed/incomplete inventory JSON")
    parser.add_argument(
        "--generated-at",
        help="override the failed inventory generated_at timestamp, useful for reproducible tests",
    )
    parser.add_argument("--write-metadata", action="store_true", help="seed benchmark metadata into problem registry JSON")
    parser.add_argument("--check-metadata", action="store_true", help="validate analyzer coverage and registry metadata")
    return parser


def main() -> None:
    args = build_parser().parse_args()
    specs = load_problem_specs()
    analyses = analyze_all(specs, args.raw_dir)
    markdown = render_markdown(analyses, args.raw_dir)
    if args.write_metadata:
        write_registry_metadata(analyses)
        specs = load_problem_specs()
        analyses = analyze_all(specs, args.raw_dir)
    if args.output:
        write_markdown(args.output, markdown)
    elif not args.failed_json:
        print(markdown)
    if args.failed_json:
        inventory = build_inventory(analyses, args.raw_dir, observed_status, generated_at=args.generated_at)
        args.failed_json.parent.mkdir(parents=True, exist_ok=True)
        args.failed_json.write_text(json.dumps(inventory, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    if args.check_metadata:
        diagnostics = validate_metadata(analyses)
        if diagnostics:
            raise SystemExit("\n".join(diagnostics))


if __name__ == "__main__":
    main()
