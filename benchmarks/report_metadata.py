from __future__ import annotations

from html import escape
from pathlib import Path
from typing import Any

from specs import fixture_stem

STATUS_LABELS = {
    "complete": "complete",
    "partial": "partial",
    "failed_build": "failed build",
    "failed_correctness": "failed correctness",
    "failed_timeout": "failed timeout",
    "unknown": "unknown",
}
PARITY_LABELS = {
    "equivalent": "equivalent",
    "known_divergent": "known divergent",
    "unknown": "parity unknown",
    "failed_correctness": "failed correctness",
}
OWNER_LABELS = {
    "compiler": "compiler",
    "leetcode_sifr_code": "LeetCode code",
    "mixed": "mixed",
    "noise": "noise",
    "unknown": "owner unknown",
}


def metadata_for_spec(spec: Any) -> dict[str, Any]:
    return {
        "benchmark_status": spec.benchmark_status or "unknown",
        "parity_status": spec.parity_status or "unknown",
        "primary_slowness_owner": spec.primary_slowness_owner or "unknown",
        "slowness_tags": list(spec.slowness_tags or []),
    }


def include_in_apples_to_apples_summary(impls: dict[str, dict[str, Any]]) -> bool:
    row = next(iter(impls.values()), None)
    if row is None:
        return False
    return row.get("benchmark_status") == "complete" and row.get("parity_status") == "equivalent"


def metadata_data_attrs(metadata: Any) -> str:
    if not isinstance(metadata, dict):
        metadata = metadata_for_spec(metadata)
    tags = " ".join(str(tag) for tag in metadata["slowness_tags"])
    return (
        f'data-status="{escape(str(metadata["benchmark_status"]))}" '
        f'data-parity="{escape(str(metadata["parity_status"]))}" '
        f'data-owner="{escape(str(metadata["primary_slowness_owner"]))}" '
        f'data-tags="{escape(tags)}"'
    )


def badge(class_name: str, value: str, label: str) -> str:
    return f'<span class="meta-badge {class_name} {escape(value)}">{escape(label)}</span>'


def metadata_badges(metadata: Any) -> str:
    if not isinstance(metadata, dict):
        metadata = metadata_for_spec(metadata)
    status = str(metadata["benchmark_status"])
    parity = str(metadata["parity_status"])
    owner = str(metadata["primary_slowness_owner"])
    badges = [
        badge("status", status, STATUS_LABELS.get(status, status.replace("_", " "))),
        badge("parity", parity, PARITY_LABELS.get(parity, parity.replace("_", " "))),
    ]
    if owner != "unknown":
        badges.append(badge("owner", owner, OWNER_LABELS.get(owner, owner.replace("_", " "))))
    return "".join(badges)


def comparable_problem_ids(specs: dict[str, Any]) -> set[str]:
    return {
        problem_id
        for problem_id, spec in specs.items()
        if spec.benchmark_status == "complete" and spec.parity_status == "equivalent"
    }


def metadata_stats(specs: dict[str, Any], results_dir: Path) -> dict[str, int]:
    complete = 0
    partial = 0
    failed = 0
    known_divergent = 0
    equivalent = 0
    for spec in specs.values():
        pair_count = 0
        for size in spec.sizes:
            result_path = results_dir / f"{spec.problem_id}_{fixture_stem(spec, size)}.hyperfine.json"
            if result_path.exists():
                pair_count += 1
        if pair_count == len(spec.sizes):
            complete += 1
        elif pair_count:
            partial += 1
        if str(spec.benchmark_status).startswith("failed"):
            failed += 1
        if spec.parity_status == "known_divergent":
            known_divergent += 1
        if spec.parity_status == "equivalent":
            equivalent += 1
    return {
        "complete": complete,
        "partial": partial,
        "failed": failed,
        "known_divergent": known_divergent,
        "equivalent": equivalent,
    }


def metadata_filter_controls() -> str:
    return """
        <label><input type="checkbox" data-meta-filter="parity" value="equivalent" checked> equivalent</label>
        <label><input type="checkbox" data-meta-filter="parity" value="known_divergent" checked> divergent</label>
        <label><input type="checkbox" data-meta-filter="parity" value="unknown" checked> unknown parity</label>
        <label><input type="checkbox" data-meta-filter="owner" value="compiler" checked> compiler</label>
        <label><input type="checkbox" data-meta-filter="owner" value="leetcode_sifr_code" checked> code</label>
        <label><input type="checkbox" data-meta-filter="owner" value="mixed" checked> mixed</label>
    """


def metadata_summary_panel(specs: dict[str, Any], results_dir: Path) -> str:
    stats = metadata_stats(specs, results_dir)
    failed = sorted(
        (spec for spec in specs.values() if str(spec.benchmark_status).startswith("failed")),
        key=lambda spec: spec.problem_id,
    )
    partial = sorted(
        (spec for spec in specs.values() if spec.benchmark_status == "partial"),
        key=lambda spec: spec.problem_id,
    )
    failed_items = "".join(
        f"<li><code>{escape(spec.problem_id)}</code>{metadata_badges(spec)}</li>" for spec in failed
    )
    partial_items = "".join(
        f"<li><code>{escape(spec.problem_id)}</code>{metadata_badges(spec)}</li>" for spec in partial
    )
    return f"""
    <section class="meta-panel coverage-panel">
      <p class="eyebrow">Benchmark Coverage</p>
      <div class="coverage-stats">
        <div><span>Complete results</span><strong>{stats["complete"]}</strong></div>
        <div><span>Partial results</span><strong>{stats["partial"]}</strong></div>
        <div><span>Failed benchmark blockers</span><strong>{stats["failed"]}</strong></div>
        <div><span>Known divergent implementations</span><strong>{stats["known_divergent"]}</strong></div>
      </div>
      <details><summary>Partial and failed problem inventory</summary><ul>{partial_items}{failed_items}</ul></details>
    </section>
    """


def metadata_styles() -> str:
    return """
    .metadata-row { display: flex; flex-wrap: wrap; gap: 7px; align-items: center; }
    .meta-badge { display: inline-flex; align-items: center; border-radius: 999px; padding: 5px 9px; font-size: 12px; font-weight: 800; background: #f2f4f7; color: var(--muted); white-space: nowrap; }
    .meta-badge.parity.equivalent { background: #ecfdf3; color: var(--green); }
    .meta-badge.parity.known_divergent, .meta-badge.status.failed_build, .meta-badge.status.failed_correctness, .meta-badge.status.failed_timeout { background: #fff7ed; color: var(--amber); }
    .meta-badge.owner.compiler { background: #eff6ff; color: var(--blue); }
    .meta-badge.owner.leetcode_sifr_code { background: #fef2f2; color: var(--red); }
    .meta-badge.owner.mixed { background: #eef2ff; color: var(--indigo); }
    .coverage-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
    .coverage-stats div { border: 1px solid var(--line); border-radius: 8px; padding: 12px; background: var(--soft); }
    .coverage-stats span { display: block; color: var(--muted); font-size: 12px; }
    .coverage-stats strong { display: block; margin-top: 4px; font-size: 22px; }
    .coverage-panel ul { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 8px 12px; padding-left: 18px; }
    .coverage-panel li { padding-right: 12px; }
    """
