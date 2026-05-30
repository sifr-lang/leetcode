from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path
from typing import Any, Callable

from slowness_seed import FAILED_SEED, SLOWNESS_SEED

SCHEMA_VERSION = "leetcode_failed_benchmark_inventory_v1"

VALID_PRIMARY_TRACKS = {
    "benchmark_harness",
    "leetcode_sifr_code",
    "mixed_harness_and_code",
    "compiler_followup",
}

VALID_FAILURE_MODES = {
    "moved_result_rendering",
    "moved_owned_tree_input",
    "structured_result_display",
    "division_result_unhandled",
    "float_conversion_unhandled",
    "nullable_signature_mismatch",
    "typed_stack_inference",
    "correctness_duplicate_output",
    "correctness_expected_shape",
    "timeout_stateful_object",
    "moved_string_parameter",
}


FAILED_DETAILS: dict[str, dict[str, str]] = {
    "0234_palindrome_linked_list": {
        "primary_track": "leetcode_sifr_code",
        "failure_mode": "nullable_signature_mismatch",
        "first_fix": "accept_nullable_list_node_entrypoint",
    },
}


def failure_excerpt(problem_id: str, raw_dir: Path) -> str:
    log_path = raw_dir / f"{problem_id}.run.log"
    if not log_path.exists():
        return "no complete Python/Sifr result pair was recorded"
    for line in log_path.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.strip()
        if line:
            return line[:220]
    return "empty run log"


def build_inventory(
    analyses: list[Any],
    raw_dir: Path,
    observed_status: Callable[[Any], str],
    *,
    generated_at: str | None = None,
) -> dict[str, Any]:
    rows = []
    for analysis in sorted(analyses, key=lambda item: item.spec.problem_id):
        if not (analysis.is_partial or analysis.has_no_pair):
            continue
        problem_id = analysis.spec.problem_id
        detail = FAILED_DETAILS.get(problem_id)
        if detail is None:
            continue
        rows.append(
            {
                "problem_id": problem_id,
                "benchmark_status": observed_status(analysis),
                "primary_track": detail["primary_track"],
                "failure_mode": detail["failure_mode"],
                "failure_excerpt": failure_excerpt(problem_id, raw_dir),
                "first_fix": detail["first_fix"],
                "related_slowness_phase": problem_id in SLOWNESS_SEED,
            }
        )
    return {
        "schema_version": SCHEMA_VERSION,
        "source_raw_dir": str(raw_dir),
        "generated_at": generated_at or datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "problem_count": len(rows),
        "problems": rows,
    }


def validate_details() -> list[str]:
    diagnostics = []
    missing = sorted(set(FAILED_SEED) - set(FAILED_DETAILS))
    extra = sorted(set(FAILED_DETAILS) - set(FAILED_SEED))
    if missing:
        diagnostics.append(f"missing failed inventory details: {', '.join(missing)}")
    if extra:
        diagnostics.append(f"failed inventory details without seed metadata: {', '.join(extra)}")
    for problem_id, detail in FAILED_DETAILS.items():
        primary_track = detail.get("primary_track")
        failure_mode = detail.get("failure_mode")
        if primary_track not in VALID_PRIMARY_TRACKS:
            diagnostics.append(f"{problem_id}: invalid primary_track {primary_track!r}")
        if failure_mode not in VALID_FAILURE_MODES:
            diagnostics.append(f"{problem_id}: invalid failure_mode {failure_mode!r}")
        if not detail.get("first_fix"):
            diagnostics.append(f"{problem_id}: first_fix must be non-empty")
    return diagnostics
