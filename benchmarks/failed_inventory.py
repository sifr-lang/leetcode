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
    "0021_merge_two_sorted_lists": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_result_rendering",
        "first_fix": "render_structured_result_once_in_runner",
    },
    "0234_palindrome_linked_list": {
        "primary_track": "leetcode_sifr_code",
        "failure_mode": "nullable_signature_mismatch",
        "first_fix": "accept_nullable_list_node_entrypoint",
    },
    "0203_remove_linked_list_elements": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_result_rendering",
        "first_fix": "render_structured_result_once_in_runner",
    },
    "0083_remove_duplicates_from_sorted_list": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_result_rendering",
        "first_fix": "render_structured_result_once_in_runner",
    },
    "0876_middle_of_the_linked_list": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_result_rendering",
        "first_fix": "render_structured_result_once_in_runner",
    },
    "0019_remove_nth_node_from_end_of_list": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_result_rendering",
        "first_fix": "render_structured_result_once_in_runner",
    },
    "1721_swapping_nodes_in_a_linked_list": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_result_rendering",
        "first_fix": "render_structured_result_once_in_runner",
    },
    "0002_add_two_numbers": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_result_rendering",
        "first_fix": "render_structured_result_once_in_runner",
    },
    "0141_linked_list_cycle": {
        "primary_track": "leetcode_sifr_code",
        "failure_mode": "nullable_signature_mismatch",
        "first_fix": "accept_nullable_list_node_entrypoint",
    },
    "0024_swap_nodes_in_pairs": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_result_rendering",
        "first_fix": "render_structured_result_once_in_runner",
    },
    "0148_sort_list": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_result_rendering",
        "first_fix": "render_structured_result_once_in_runner",
    },
    "0086_partition_list": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_result_rendering",
        "first_fix": "render_structured_result_once_in_runner",
    },
    "0061_rotate_list": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_result_rendering",
        "first_fix": "render_structured_result_once_in_runner",
    },
    "0147_insertion_sort_list": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_result_rendering",
        "first_fix": "render_structured_result_once_in_runner",
    },
    "0025_reverse_nodes_in_k_group": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_result_rendering",
        "first_fix": "render_structured_result_once_in_runner",
    },
    "0707_design_linked_list": {
        "primary_track": "leetcode_sifr_code",
        "failure_mode": "timeout_stateful_object",
        "first_fix": "replace_recursive_rebuilds_with_predictable_state",
    },
    "0144_binary_tree_preorder_traversal": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_owned_tree_input",
        "first_fix": "rebuild_owned_tree_input_per_call",
    },
    "0145_binary_tree_postorder_traversal": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_owned_tree_input",
        "first_fix": "rebuild_owned_tree_input_per_call",
    },
    "0226_invert_binary_tree": {
        "primary_track": "benchmark_harness",
        "failure_mode": "structured_result_display",
        "first_fix": "use_tree_formatter_for_wrong_result_output",
    },
    "0108_convert_sorted_array_to_binary_search_tree": {
        "primary_track": "benchmark_harness",
        "failure_mode": "structured_result_display",
        "first_fix": "use_tree_formatter_for_wrong_result_output",
    },
    "0617_merge_two_binary_trees": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_owned_tree_input",
        "first_fix": "rebuild_owned_tree_inputs_per_call",
    },
    "0701_insert_into_a_binary_search_tree": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_owned_tree_input",
        "first_fix": "rebuild_owned_tree_input_per_call",
    },
    "0450_delete_node_in_a_bst": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_owned_tree_input",
        "first_fix": "rebuild_owned_tree_input_per_call",
    },
    "0103_binary_tree_zigzag_level_order_traversal": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_owned_tree_input",
        "first_fix": "rebuild_owned_tree_input_per_call",
    },
    "0106_construct_binary_tree_from_inorder_and_postorder_traversal": {
        "primary_track": "benchmark_harness",
        "failure_mode": "structured_result_display",
        "first_fix": "use_tree_formatter_for_wrong_result_output",
    },
    "0662_maximum_width_of_binary_tree": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_owned_tree_input",
        "first_fix": "rebuild_owned_tree_input_per_call",
    },
    "1448_count_good_nodes_in_binary_tree": {
        "primary_track": "leetcode_sifr_code",
        "failure_mode": "nullable_signature_mismatch",
        "first_fix": "accept_nullable_tree_node_entrypoint",
    },
    "0230_kth_smallest_element_in_a_bst": {
        "primary_track": "leetcode_sifr_code",
        "failure_mode": "nullable_signature_mismatch",
        "first_fix": "accept_nullable_tree_node_or_mark_non_nullable",
    },
    "0105_construct_binary_tree_from_preorder_and_inorder_traversal": {
        "primary_track": "benchmark_harness",
        "failure_mode": "structured_result_display",
        "first_fix": "use_tree_formatter_for_wrong_result_output",
    },
    "0513_find_bottom_left_tree_value": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_owned_tree_input",
        "first_fix": "rebuild_owned_tree_input_per_call",
    },
    "0669_trim_a_binary_search_tree": {
        "primary_track": "benchmark_harness",
        "failure_mode": "moved_owned_tree_input",
        "first_fix": "rebuild_owned_tree_input_per_call",
    },
    "0269_alien_dictionary": {
        "primary_track": "benchmark_harness",
        "failure_mode": "correctness_expected_shape",
        "first_fix": "validate_topological_order_shape",
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
