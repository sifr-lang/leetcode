from __future__ import annotations

import json
import math
import statistics
import time
from html import escape
from pathlib import Path
from typing import Any

from report_format import format_fold
from report_metadata import (
    include_in_apples_to_apples_summary,
    metadata_badges,
    metadata_data_attrs,
    metadata_styles,
)
from report_interactions import report_script
from report_payload import json_safe
from report_table import IMPL_COLORS, comparison_header, comparison_rows, impl_label, memory_title, runtime_title, sorted_impls


DEFAULT_CANDIDATE_IMPL = "sifr"
DEFAULT_BASELINE_IMPL = "python"

def fixture_stem(spec: Any, size: int) -> str:
    return spec.fixture_stem.format(size=size)

def load_memory_rows(path: Path) -> dict[str, dict[str, Any]]:
    memory_path = Path(str(path).replace(".hyperfine.json", ".memory.json"))
    if not memory_path.exists():
        return {}
    data = json.loads(memory_path.read_text(encoding="utf-8"))
    return {measurement["impl"]: measurement for measurement in data.get("measurements", [])}

def summarize_result(path: Path, spec: Any, size: int) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    memory_rows = load_memory_rows(path)
    rows = []
    operations = size * spec.loops_by_size[size]
    for result in data.get("results", []):
        command = result["command"]
        impl = command.split(":", 1)[0]
        mean = float(result["mean"])
        stddev = float(result["stddev"] or 0.0)
        median = float(result.get("median") or mean)
        min_value = float(result.get("min") or mean)
        max_value = float(result.get("max") or mean)
        user = float(result.get("user") or 0.0)
        system = float(result.get("system") or 0.0)
        cv = stddev / mean if mean else math.inf
        throughput = operations / mean if mean > 0 else None
        time_per_op_ns = (mean / operations) * 1_000_000_000 if operations > 0 else None
        memory_row = memory_rows.get(impl, {})
        memory_values = memory_row.get("rss_bytes") or []
        memory_mb = (
            statistics.mean(float(value) for value in memory_values) / (1024 * 1024)
            if memory_values
            else None
        )
        peak_memory_mb = (
            max(float(value) for value in memory_values) / (1024 * 1024)
            if memory_values
            else None
        )
        rows.append(
            {
                "category": spec.category,
                "problem": spec.problem_id,
                "benchmark_status": spec.benchmark_status,
                "parity_status": spec.parity_status,
                "primary_slowness_owner": spec.primary_slowness_owner,
                "slowness_tags": list(spec.slowness_tags),
                "size": size,
                "impl": impl,
                "operations": operations,
                "mean_ms": mean * 1000,
                "median_ms": median * 1000,
                "min_ms": min_value * 1000,
                "max_ms": max_value * 1000,
                "stddev_ms": stddev * 1000,
                "user_ms": user * 1000,
                "system_ms": system * 1000,
                "cv": cv,
                "throughput_per_s": throughput,
                "time_per_op_ns": time_per_op_ns,
                "memory_mb": memory_mb,
                "peak_memory_mb": peak_memory_mb,
                "memory_source": "/usr/bin/time" if memory_values else None,
                "verdict": "noisy" if cv > 0.10 else "stable",
            }
        )
    return rows

def collect_summary_rows(problem_ids: list[str], specs: dict[str, Any], results_dir: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    selected = [specs[problem_id] for problem_id in problem_ids] if problem_ids else list(specs.values())
    for spec in selected:
        for size in spec.sizes:
            result_path = results_dir / f"{spec.problem_id}_{fixture_stem(spec, size)}.hyperfine.json"
            if result_path.exists():
                rows.extend(summarize_result(result_path, spec, size))
    return rows

def print_summary(problem_ids: list[str], specs: dict[str, Any], results_dir: Path) -> None:
    rows = collect_summary_rows(problem_ids, specs, results_dir)
    if not rows:
        print("no results found")
        return
    print(
        "category,problem,size,impl,mean_ms,median_ms,min_ms,max_ms,stddev_ms,"
        "user_ms,system_ms,cv,throughput_per_s,time_per_op_ns,memory_mb,peak_memory_mb,verdict"
    )
    for row in rows:
        memory = "" if row["memory_mb"] is None else f"{row['memory_mb']:.1f}"
        peak_memory = "" if row["peak_memory_mb"] is None else f"{row['peak_memory_mb']:.1f}"
        throughput = "" if row["throughput_per_s"] is None else f"{row['throughput_per_s']:.1f}"
        time_per_op = "" if row["time_per_op_ns"] is None else f"{row['time_per_op_ns']:.2f}"
        print(
            f"{row['category']},{row['problem']},{row['size']},{row['impl']},"
            f"{row['mean_ms']:.3f},{row['median_ms']:.3f},{row['min_ms']:.3f},"
            f"{row['max_ms']:.3f},{row['stddev_ms']:.3f},{row['user_ms']:.3f},"
            f"{row['system_ms']:.3f},{row['cv']:.4f},{throughput},"
            f"{time_per_op},{memory},{peak_memory},{row['verdict']}"
        )

def format_ms(value: float | None) -> str:
    if value is None:
        return "n/a"
    if value >= 1000:
        return f"{value / 1000:.2f}s"
    return f"{value:.1f}ms"

def format_rate(value: float | None) -> str:
    if value is None:
        return "n/a"
    if value >= 1_000_000:
        return f"{value / 1_000_000:.2f}M/s"
    if value >= 1_000:
        return f"{value / 1_000:.1f}K/s"
    return f"{value:.0f}/s"

def format_memory(value: float | None) -> str:
    if value is None:
        return "n/a"
    return f"{value:.1f} MB"

def format_ns(value: float | None) -> str:
    if value is None:
        return "n/a"
    if value >= 1_000:
        return f"{value / 1_000:.2f} us/op"
    return f"{value:.1f} ns/op"

def grouped_report_rows(rows: list[dict[str, Any]]) -> dict[str, dict[str, dict[int, dict[str, dict[str, Any]]]]]:
    grouped: dict[str, dict[str, dict[int, dict[str, dict[str, Any]]]]] = {}
    for row in rows:
        grouped.setdefault(row["category"], {}).setdefault(row["problem"], {}).setdefault(row["size"], {})[
            row["impl"]
        ] = row
    return grouped

def report_stats(
    rows: list[dict[str, Any]],
    candidate_impl: str = DEFAULT_CANDIDATE_IMPL,
    baseline_impl: str = DEFAULT_BASELINE_IMPL,
) -> dict[str, Any]:
    pair_speedups = []
    memory_deltas = []
    problem_ids = set()
    categories = set()
    stable_pairs = 0
    total_pairs = 0
    for category, problems in grouped_report_rows(rows).items():
        for problem_id, sizes in problems.items():
            for impls in sizes.values():
                baseline = impls.get(baseline_impl)
                candidate = impls.get(candidate_impl)
                if baseline and candidate and candidate["mean_ms"] > 0:
                    if not include_in_apples_to_apples_summary(impls):
                        continue
                    categories.add(category)
                    problem_ids.add(problem_id)
                    pair_speedups.append(baseline["mean_ms"] / candidate["mean_ms"])
                    memory_delta = memory_delta_for_impls(impls, candidate_impl, baseline_impl)
                    if memory_delta is not None:
                        memory_deltas.append(memory_delta)
                    total_pairs += 1
                    if baseline["verdict"] == "stable" and candidate["verdict"] == "stable":
                        stable_pairs += 1
    return {
        "categories": len(categories),
        "problems": len(problem_ids),
        "comparisons": total_pairs,
        "stable_pairs": stable_pairs,
        "average_speedup": statistics.mean(pair_speedups) if pair_speedups else None,
        "median_speedup": statistics.median(pair_speedups) if pair_speedups else None,
        "max_speedup": max(pair_speedups) if pair_speedups else None,
        "median_memory_delta": statistics.median(memory_deltas) if memory_deltas else None,
        "memory_comparisons": len(memory_deltas),
    }

def speedup_tier(speedup: float | None) -> str:
    if speedup is None:
        return "neutral"
    if speedup >= 3:
        return "strong"
    if speedup >= 2:
        return "good"
    if speedup >= 1:
        return "marginal"
    return "regress"

def runtime_tier_title(
    tier: str,
    candidate_impl: str = DEFAULT_CANDIDATE_IMPL,
    baseline_impl: str = DEFAULT_BASELINE_IMPL,
) -> str:
    return runtime_title(tier, candidate_impl, baseline_impl)


def memory_tier_title(
    tier: str,
    candidate_impl: str = DEFAULT_CANDIDATE_IMPL,
    baseline_impl: str = DEFAULT_BASELINE_IMPL,
) -> str:
    return memory_title(tier, candidate_impl, baseline_impl)

def delta_tier(value: float | None) -> str:
    if value is None:
        return "neutral"
    if value >= 0.10:
        return "strong"
    if value >= 0.02:
        return "good"
    if value > -0.02:
        return "neutral"
    return "regress"

def format_runtime_advantage(speedup: float | None, candidate_impl: str = DEFAULT_CANDIDATE_IMPL) -> str:
    candidate = impl_label(candidate_impl)
    if speedup is None:
        return "n/a"
    if speedup >= 1:
        return f"{candidate} {format_fold(speedup)} faster"
    return f"{candidate} {format_fold(1 / speedup)} slower"

def format_memory_advantage(
    delta: float | None,
    *,
    candidate_impl: str = DEFAULT_CANDIDATE_IMPL,
    include_metric: bool = False,
) -> str:
    prefix = "Memory: " if include_metric else ""
    candidate = impl_label(candidate_impl)
    if delta is None:
        return f"{prefix}n/a"
    if abs(delta) < 0.02:
        return f"{prefix}about equal"
    direction = "less" if delta > 0 else "more"
    return f"{prefix}{candidate} {abs(delta) * 100:.0f}% {direction}"

def format_cv(value: float | None) -> str:
    if value is None:
        return "n/a"
    return f"{value * 100:.1f}%"

def format_number(value: float | None) -> str:
    if value is None:
        return "n/a"
    return f"{value:,.0f}"

def speedup_for_impls(
    impls: dict[str, dict[str, Any]],
    candidate_impl: str = DEFAULT_CANDIDATE_IMPL,
    baseline_impl: str = DEFAULT_BASELINE_IMPL,
) -> float | None:
    candidate = impls.get(candidate_impl)
    baseline = impls.get(baseline_impl)
    if not candidate or not baseline or candidate["mean_ms"] <= 0:
        return None
    if candidate["operations"] != baseline["operations"]:
        return None
    return baseline["mean_ms"] / candidate["mean_ms"]

def memory_delta_for_impls(
    impls: dict[str, dict[str, Any]],
    candidate_impl: str = DEFAULT_CANDIDATE_IMPL,
    baseline_impl: str = DEFAULT_BASELINE_IMPL,
) -> float | None:
    candidate = impls.get(candidate_impl)
    baseline = impls.get(baseline_impl)
    if not candidate or not baseline:
        return None
    baseline_memory = baseline.get("peak_memory_mb")
    candidate_memory = candidate.get("peak_memory_mb")
    if baseline_memory is None or candidate_memory is None or baseline_memory <= 0:
        return None
    return (baseline_memory - candidate_memory) / baseline_memory

def speedups_for_sizes(
    sizes: dict[int, dict[str, dict[str, Any]]],
    candidate_impl: str = DEFAULT_CANDIDATE_IMPL,
    baseline_impl: str = DEFAULT_BASELINE_IMPL,
) -> list[tuple[int, float]]:
    pairs = []
    for size, impls in sorted(sizes.items()):
        speedup = speedup_for_impls(impls, candidate_impl, baseline_impl)
        if speedup is not None:
            pairs.append((size, speedup))
    return pairs

def problem_summary(
    sizes: dict[int, dict[str, dict[str, Any]]],
    candidate_impl: str = DEFAULT_CANDIDATE_IMPL,
    baseline_impl: str = DEFAULT_BASELINE_IMPL,
) -> dict[str, Any]:
    speedups = [speedup for _, speedup in speedups_for_sizes(sizes, candidate_impl, baseline_impl)]
    memory_deltas = [
        delta
        for impls in sizes.values()
        if (delta := memory_delta_for_impls(impls, candidate_impl, baseline_impl)) is not None
    ]
    noisy = False
    for impls in sizes.values():
        candidate = impls.get(candidate_impl)
        baseline = impls.get(baseline_impl)
        if (candidate and candidate["verdict"] == "noisy") or (baseline and baseline["verdict"] == "noisy"):
            noisy = True
    return {
        "median_speedup": statistics.median(speedups) if speedups else None,
        "median_memory_delta": statistics.median(memory_deltas) if memory_deltas else None,
        "max_speedup": max(speedups) if speedups else 1.0,
        "noisy": noisy,
    }

def category_summary(
    problems: dict[str, dict[int, dict[str, dict[str, Any]]]],
    candidate_impl: str = DEFAULT_CANDIDATE_IMPL,
    baseline_impl: str = DEFAULT_BASELINE_IMPL,
) -> dict[str, Any]:
    summaries = [
        problem_summary(sizes, candidate_impl, baseline_impl)
        for sizes in problems.values()
    ]
    speedups = [summary["median_speedup"] for summary in summaries if summary["median_speedup"] is not None]
    memory = [summary["median_memory_delta"] for summary in summaries if summary["median_memory_delta"] is not None]
    return {
        "median_speedup": statistics.median(speedups) if speedups else None,
        "median_memory_delta": statistics.median(memory) if memory else None,
        "noisy": any(summary["noisy"] for summary in summaries),
    }

def format_size_label(size: int) -> str:
    if size >= 1_000_000:
        return f"{size / 1_000_000:g}M"
    if size >= 1_000:
        return f"{size / 1_000:g}K"
    return str(size)

def format_axis_ms(value: float) -> str:
    if value >= 1000:
        return f"{value / 1000:.2g}s"
    if value >= 100:
        return f"{value:.0f}ms"
    return f"{value:.1f}ms"

def format_axis_memory(value: float) -> str:
    if value >= 1000:
        return f"{value / 1024:.2g} GB"
    if value >= 100:
        return f"{value:.0f} MB"
    return f"{value:.1f} MB"

def log_x_positions(sizes: list[int], left: int, width: int) -> dict[int, float]:
    if len(sizes) == 1:
        return {sizes[0]: left + (width / 2)}
    logs = [math.log10(size) for size in sizes]
    minimum = min(logs)
    span = max(logs) - minimum or 1.0
    return {size: left + ((math.log10(size) - minimum) / span) * width for size in sizes}

def svg_points(points: list[tuple[float, float]]) -> str:
    return " ".join(f"{x:.1f},{y:.1f}" for x, y in points)

def collect_metric_points(
    sizes: dict[int, dict[str, dict[str, Any]]],
    key: str,
    impl_names: tuple[str, str] = (DEFAULT_BASELINE_IMPL, DEFAULT_CANDIDATE_IMPL),
) -> dict[str, list[tuple[int, float]]]:
    points: dict[str, list[tuple[int, float]]] = {impl: [] for impl in impl_names}
    for size, impls in sorted(sizes.items()):
        for impl in impl_names:
            row = impls.get(impl)
            value = row.get(key) if row else None
            if value is not None and value > 0:
                points[impl].append((size, float(value)))
    return points

def metric_range_label(
    sizes: dict[int, dict[str, dict[str, Any]]],
    key: str,
    formatter: Any,
) -> str:
    values = [
        row[key]
        for impls in sizes.values()
        for row in impls.values()
        if row.get(key) is not None and row[key] > 0
    ]
    if not values:
        return "n/a"
    return f"{formatter(min(values))}-{formatter(max(values))}"

def y_scale(values: list[float], *, log_scale: bool) -> tuple[list[float], Any]:
    if log_scale:
        log_values = [math.log10(value) for value in values]
        min_log = min(log_values)
        max_log = max(log_values)
        if math.isclose(min_log, max_log):
            min_log -= 0.5
            max_log += 0.5
        else:
            padding = (max_log - min_log) * 0.08
            min_log -= padding
            max_log += padding
        log_span = max_log - min_log

        def normalize(value: float) -> float:
            return (math.log10(value) - min_log) / log_span

        return [10 ** (min_log + (log_span * index / 4)) for index in range(5)], normalize

    minimum = min(values)
    maximum = max(values)
    if math.isclose(minimum, maximum):
        minimum = max(0.0, minimum * 0.8)
        maximum *= 1.2
    else:
        padding = (maximum - minimum) * 0.10
        minimum = max(0.0, minimum - padding)
        maximum += padding
    span = maximum - minimum or 1.0

    def normalize(value: float) -> float:
        return (value - minimum) / span

    return [minimum + (span * index / 4) for index in range(5)], normalize

def dual_line_chart(
    sizes: dict[int, dict[str, dict[str, Any]]],
    *,
    key: str,
    chart_class: str,
    aria_label: str,
    y_axis_title: str,
    y_formatter: Any,
    log_y: bool,
    impl_names: tuple[str, str] = (DEFAULT_BASELINE_IMPL, DEFAULT_CANDIDATE_IMPL),
    overlap_tolerance: float | None = None,
    overlap_note: str | None = None,
) -> str:
    points = collect_metric_points(sizes, key, impl_names)
    all_points = [point for impl in impl_names for point in points[impl]]
    if not all_points:
        return '<span class="empty-chart">n/a</span>'
    width = 720
    height = 330
    left = 104
    right = 28
    top = 24
    bottom = 62
    plot_width = width - left - right
    plot_height = height - top - bottom
    sizes_list = sorted({size for size, _ in all_points})
    x_positions = log_x_positions(sizes_list, left, plot_width)
    values = [value for _, value in all_points]
    y_ticks, normalize_y = y_scale(values, log_scale=log_y)

    def y_pos(value: float) -> float:
        return top + plot_height - (normalize_y(value) * plot_height)

    overlap_sizes: set[int] = set()
    if overlap_tolerance is not None:
        values_by_impl = {
            impl: {size: value for size, value in impl_points}
            for impl, impl_points in points.items()
        }
        baseline_impl, candidate_impl = impl_names
        for size, baseline_value in values_by_impl[baseline_impl].items():
            candidate_value = values_by_impl[candidate_impl].get(size)
            if candidate_value is None:
                continue
            denominator = max(abs(baseline_value), abs(candidate_value), 1.0)
            if abs(baseline_value - candidate_value) / denominator <= overlap_tolerance:
                overlap_sizes.add(size)

    grid = []
    for tick in y_ticks:
        y = y_pos(tick)
        grid.append(f'<line x1="{left}" y1="{y:.1f}" x2="{width - right}" y2="{y:.1f}"></line>')
        grid.append(
            f'<text class="axis-label" x="{left - 10}" y="{y + 4:.1f}" text-anchor="end">{y_formatter(tick)}</text>'
        )
    x_ticks = "".join(
        f'<text class="axis-label" x="{x_positions[size]:.1f}" y="{height - 34}" text-anchor="middle">{format_size_label(size)}</text>'
        for size in sizes_list
    )
    x_grid = "".join(
        f'<line x1="{x_positions[size]:.1f}" y1="{top}" x2="{x_positions[size]:.1f}" y2="{height - bottom}"></line>'
        for size in sizes_list
    )

    def series(impl: str, index: int) -> tuple[str, str]:
        offset = -3.0 if index == 0 else 3.0
        coordinates = [
            (x_positions[size], y_pos(value) + (offset if size in overlap_sizes else 0.0))
            for size, value in points[impl]
        ]
        circles = "".join(
            f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4"><title>{impl_label(impl)}: {y_formatter(value)}</title></circle>'
            for (size, value), (x, y) in zip(points[impl], coordinates, strict=True)
        )
        return svg_points(coordinates), circles

    baseline_impl, candidate_impl = impl_names
    baseline_line, baseline_circles = series(baseline_impl, 0)
    candidate_line, candidate_circles = series(candidate_impl, 1)
    baseline_color = IMPL_COLORS.get(baseline_impl, "#475467")
    candidate_color = IMPL_COLORS.get(candidate_impl, "#475467")
    note = ""
    if overlap_sizes and overlap_note:
        note = f'<p class="chart-note">{escape(overlap_note)}</p>'
    return f"""
    <svg class="axis-chart {chart_class}" viewBox="0 0 {width} {height}" role="img" aria-label="{escape(aria_label)}">
      <g class="grid">{''.join(grid)}{x_grid}</g>
      <line class="axis" x1="{left}" y1="{top}" x2="{left}" y2="{height - bottom}"></line>
      <line class="axis" x1="{left}" y1="{height - bottom}" x2="{width - right}" y2="{height - bottom}"></line>
      <polyline class="line" style="stroke: {baseline_color}" points="{baseline_line}"></polyline>
      <g class="series" style="--impl-color: {baseline_color}">{baseline_circles}</g>
      <polyline class="line" style="stroke: {candidate_color}" points="{candidate_line}"></polyline>
      <g class="series" style="--impl-color: {candidate_color}">{candidate_circles}</g>
      {x_ticks}
      <g class="chart-legend" transform="translate({width - 178} 24)">
        <circle class="legend-dot" style="--impl-color: {baseline_color}" cx="0" cy="0" r="4"></circle><text x="10" y="4">{impl_label(baseline_impl)}</text>
        <circle class="legend-dot" style="--impl-color: {candidate_color}" cx="82" cy="0" r="4"></circle><text x="92" y="4">{impl_label(candidate_impl)}</text>
      </g>
      <text class="axis-title" x="{left + plot_width / 2:.1f}" y="{height - 8}" text-anchor="middle">Input size (log scale)</text>
      <text class="axis-title" transform="rotate(-90 20 {top + plot_height / 2:.1f})" x="20" y="{top + plot_height / 2:.1f}" text-anchor="middle">{escape(y_axis_title)}</text>
    </svg>
    {note}
    """

def category_language_metric_table(rows: list[dict[str, Any]], key: str) -> tuple[list[str], list[str], dict[str, dict[str, float]]]:
    categories = list(dict.fromkeys(row["category"] for row in rows))
    impl_names = sorted_impls({row["impl"]: row for row in rows})
    grouped_values: dict[str, dict[str, list[float]]] = {
        category: {impl: [] for impl in impl_names} for category in categories
    }
    for row in rows:
        value = row.get(key)
        if value is not None and value > 0:
            grouped_values[row["category"]][row["impl"]].append(float(value))
    metrics = {
        category: {
            impl: statistics.median(values)
            for impl, values in impl_values.items()
            if values
        }
        for category, impl_values in grouped_values.items()
    }
    return categories, impl_names, metrics

def short_category_label(category: str) -> str:
    return category.replace(" & ", " / ")

def category_language_bar_chart(
    rows: list[dict[str, Any]],
    *,
    key: str,
    title: str,
    y_axis_title: str,
    formatter: Any,
    log_y: bool,
) -> str:
    categories, impl_names, metrics = category_language_metric_table(rows, key)
    values = [
        value
        for category_values in metrics.values()
        for value in category_values.values()
        if value > 0
    ]
    if not values:
        return '<span class="empty-chart">n/a</span>'

    width = max(1040, 150 + (len(categories) * max(74, len(impl_names) * 18 + 34)))
    height = 430
    left = 92
    right = 28
    top = 30
    bottom = 126
    plot_width = width - left - right
    plot_height = height - top - bottom
    y_ticks, normalize_y = y_scale(values, log_scale=log_y)

    def y_pos(value: float) -> float:
        return top + plot_height - (normalize_y(value) * plot_height)

    grid = []
    for tick in y_ticks:
        y = y_pos(tick)
        grid.append(f'<line x1="{left}" y1="{y:.1f}" x2="{width - right}" y2="{y:.1f}"></line>')
        grid.append(
            f'<text class="axis-label" x="{left - 10}" y="{y + 4:.1f}" text-anchor="end">{formatter(tick)}</text>'
        )

    group_width = plot_width / max(len(categories), 1)
    bar_gap = 2.0
    bar_width = max(7.0, min(16.0, (group_width - 18.0 - (bar_gap * (len(impl_names) - 1))) / max(len(impl_names), 1)))
    total_bar_width = (bar_width * len(impl_names)) + (bar_gap * max(len(impl_names) - 1, 0))
    bars = []
    labels = []
    for category_index, category in enumerate(categories):
        group_center = left + (category_index * group_width) + (group_width / 2)
        labels.append(
            f'<text class="axis-label category-axis-label" transform="translate({group_center:.1f} {height - 72}) rotate(-35)" text-anchor="end">{escape(short_category_label(category))}</text>'
        )
        for impl_index, impl in enumerate(impl_names):
            value = metrics.get(category, {}).get(impl)
            if value is None:
                continue
            x = group_center - (total_bar_width / 2) + (impl_index * (bar_width + bar_gap))
            y = y_pos(value)
            bar_height = top + plot_height - y
            color = IMPL_COLORS.get(impl, "#475467")
            bars.append(
                f'<rect x="{x:.1f}" y="{y:.1f}" width="{bar_width:.1f}" height="{bar_height:.1f}" rx="2" style="fill: {color}"><title>{escape(category)} · {impl_label(impl)}: {formatter(value)}</title></rect>'
            )

    legend_items = []
    legend_x = left
    for index, impl in enumerate(impl_names):
        x = legend_x + (index * 92)
        color = IMPL_COLORS.get(impl, "#475467")
        legend_items.append(
            f'<circle class="legend-dot" style="--impl-color: {color}" cx="{x}" cy="{height - 24}" r="4"></circle><text x="{x + 10}" y="{height - 20}">{impl_label(impl)}</text>'
        )

    return f"""
    <svg class="axis-chart category-bar-chart" viewBox="0 0 {width} {height}" role="img" aria-label="{escape(title)}">
      <g class="grid">{''.join(grid)}</g>
      <line class="axis" x1="{left}" y1="{top}" x2="{left}" y2="{height - bottom}"></line>
      <line class="axis" x1="{left}" y1="{height - bottom}" x2="{width - right}" y2="{height - bottom}"></line>
      <g class="category-bars">{''.join(bars)}</g>
      {''.join(labels)}
      <g class="chart-legend category-chart-legend">{''.join(legend_items)}</g>
      <text class="axis-title" x="{left + plot_width / 2:.1f}" y="{height - 8}" text-anchor="middle">Category</text>
      <text class="axis-title" transform="rotate(-90 20 {top + plot_height / 2:.1f})" x="20" y="{top + plot_height / 2:.1f}" text-anchor="middle">{escape(y_axis_title)}</text>
    </svg>
    """

def category_language_overview(rows: list[dict[str, Any]]) -> str:
    return f"""
    <section class="meta-panel category-language-panel">
      <p class="eyebrow">Category Comparison</p>
      <div class="visual-grid category-language-grid">
        <div class="chart-card category-language-card">
          <div><span>Runtime by category and language</span><strong>Median mean runtime</strong></div>
          <div class="category-matrix-plot">{category_language_bar_chart(rows, key="mean_ms", title="Runtime by category and language", y_axis_title="Mean runtime (log scale)", formatter=format_axis_ms, log_y=True)}</div>
        </div>
        <div class="chart-card category-language-card">
          <div><span>Memory by category and language</span><strong>Median peak RSS</strong></div>
          <div class="category-matrix-plot">{category_language_bar_chart(rows, key="peak_memory_mb", title="Memory by category and language", y_axis_title="Peak RSS (log scale)", formatter=format_axis_memory, log_y=True)}</div>
        </div>
      </div>
    </section>
    """

def memory_delta_badge(
    delta: float | None,
    candidate_impl: str = DEFAULT_CANDIDATE_IMPL,
    baseline_impl: str = DEFAULT_BASELINE_IMPL,
) -> str:
    tier = delta_tier(delta)
    return f'<span class="delta-badge memory-comparison {tier}" title="{memory_tier_title(tier, candidate_impl, baseline_impl)}">{format_memory_advantage(delta, candidate_impl=candidate_impl, include_metric=True)}</span>'

def median_impl_metric(
    sizes: dict[int, dict[str, dict[str, Any]]],
    impl: str,
    key: str,
) -> float | None:
    values = [
        row[key]
        for impls in sizes.values()
        if (row := impls.get(impl)) is not None and row.get(key) is not None
    ]
    return statistics.median(values) if values else None

def comparison_value_bars(
    sizes: dict[int, dict[str, dict[str, Any]]],
    *,
    key: str,
    title: str,
    formatter: Any,
    badge: str,
) -> str:
    impl_names = sorted_impls({impl: row for impls in sizes.values() for impl, row in impls.items()})
    values_by_impl = {impl: median_impl_metric(sizes, impl, key) for impl in impl_names}
    maximum = max((value for value in values_by_impl.values() if value is not None), default=1.0)

    def row(label: str, value: float | None, class_name: str) -> str:
        width = 0.0 if value is None or maximum <= 0 else max(5.0, (value / maximum) * 100.0)
        return f"""
        <div class="value-row {class_name}">
          <span>{label}</span>
          <i><b style="width: {width:.1f}%"></b></i>
          <strong>{formatter(value)}</strong>
        </div>
        """

    return f"""
    <div class="summary-metric">
      <div class="metric-title"><span>{title}</span>{badge}</div>
      <div class="value-bars">
        {"".join(row(impl_label(impl), values_by_impl[impl], impl) for impl in impl_names)}
      </div>
    </div>
    """

def category_problem_bars(
    problems: dict[str, dict[int, dict[str, dict[str, Any]]]],
    specs: dict[str, Any],
    candidate_impl: str = DEFAULT_CANDIDATE_IMPL,
    baseline_impl: str = DEFAULT_BASELINE_IMPL,
) -> str:
    summaries = []
    for problem_id, sizes in problems.items():
        summary = problem_summary(sizes, candidate_impl, baseline_impl)
        median = summary["median_speedup"]
        summaries.append((problem_id, median, summary, sizes))
    summaries.sort(key=lambda item: (item[1] is None, -(item[1] or 0.0), item[0]))
    bars = []
    for problem_id, median, summary, sizes in summaries:
        tier = speedup_tier(median)
        memory_delta = summary["median_memory_delta"]
        bars.append(
            f"""
            <div class="category-bar" data-problem="{escape(problem_id)}" data-tier="{tier}">
              <span>{escape(problem_id)}</span>
              <div class="metadata-row">{metadata_badges(specs[problem_id])}</div>
              {comparison_value_bars(sizes, key="mean_ms", title="Runtime", formatter=format_ms, badge=f'<strong class="summary-badge runtime-comparison {tier}" title="{runtime_tier_title(tier, candidate_impl, baseline_impl)}">{format_runtime_advantage(median, candidate_impl)}</strong>')}
              {comparison_value_bars(sizes, key="peak_memory_mb", title="Memory", formatter=format_memory, badge=memory_delta_badge(memory_delta, candidate_impl, baseline_impl))}
              <em class="variance-dot {'noisy' if summary['noisy'] else 'stable'}" title="{'Noisy benchmark measurements' if summary['noisy'] else 'Stable benchmark measurements'}"></em>
            </div>
            """
        )
    return "".join(bars)

def render_html_report(
    problem_ids: list[str],
    output_path: Path,
    specs: dict[str, Any],
    results_dir: Path,
    languages: set[str] | None = None,
) -> None:
    rows = collect_summary_rows(problem_ids, specs, results_dir)
    if languages is not None:
        rows = [row for row in rows if row["impl"] in languages]
    if not rows:
        raise SystemExit("no benchmark results found; run `python3 benchmarks/bench.py run` first")
    candidate_impl = DEFAULT_CANDIDATE_IMPL
    baseline_impl = DEFAULT_BASELINE_IMPL
    impl_pair = (baseline_impl, candidate_impl)
    stats = report_stats(rows, candidate_impl, baseline_impl)
    grouped = grouped_report_rows(rows)
    generated_at = time.strftime("%Y-%m-%d %H:%M:%S %Z")
    environment_path = results_dir / "environment.json"
    environment = json.loads(environment_path.read_text(encoding="utf-8")) if environment_path.exists() else {}

    sections = []
    for category, problems in grouped.items():
        problem_cards = []
        for problem_id, sizes in problems.items():
            spec = specs[problem_id]
            summary = problem_summary(sizes, candidate_impl, baseline_impl)
            impl_names = sorted_impls({impl: row for impls in sizes.values() for impl, row in impls.items()})
            rows_html = [
                comparison_rows(size, impls, impl_names, summary["max_speedup"], candidate_impl, baseline_impl)
                for size, impls in sorted(sizes.items())
            ]
            tier = speedup_tier(summary["median_speedup"])
            problem_cards.append(
                f"""
                <details class="problem-card" data-problem="{escape(problem_id)}" data-category="{escape(spec.category).lower()}" data-tier="{tier}" data-verdict="{'noisy' if summary['noisy'] else 'stable'}" {metadata_data_attrs(spec)}>
                  <summary class="problem-heading">
                    <div>
                      <p class="eyebrow">{escape(spec.category)}</p>
                      <h2>{escape(problem_id)}</h2>
                    </div>
                    <div class="problem-actions">
                      {metadata_badges(spec)}
                      <span class="speed-chip runtime-comparison {tier}" title="{runtime_tier_title(tier, candidate_impl, baseline_impl)}">{format_runtime_advantage(summary["median_speedup"], candidate_impl)}</span>
                      {memory_delta_badge(summary["median_memory_delta"])}
                    </div>
                  </summary>
                  <div class="problem-body">
                    <div class="visual-grid">
                      <div class="chart-card">
                        <div><span>Mean runtime vs input size</span><strong>{metric_range_label(sizes, "mean_ms", format_axis_ms)}</strong></div>
                        <div class="chart-plot" data-chart-key="mean_ms">{dual_line_chart(sizes, key="mean_ms", chart_class="runtime-chart", aria_label="Mean runtime versus input size", y_axis_title="Mean runtime (log scale)", y_formatter=format_axis_ms, log_y=True, impl_names=impl_pair)}</div>
                      </div>
                      <div class="chart-card">
                        <div><span>Peak RSS vs input size</span><strong>{metric_range_label(sizes, "peak_memory_mb", format_axis_memory)}</strong></div>
                        <div class="chart-plot" data-chart-key="peak_memory_mb">{dual_line_chart(sizes, key="peak_memory_mb", chart_class="memory-chart", aria_label="Peak RSS versus input size", y_axis_title="Peak RSS (MB, linear scale)", y_formatter=format_axis_memory, log_y=False, impl_names=impl_pair, overlap_tolerance=0.01, overlap_note="Selected RSS values are within measurement noise; lines are separated slightly for visibility.")}</div>
                      </div>
                    </div>
                    <div class="table-wrap">
                      <table class="comparison-table">
                        {comparison_header(impl_names)}
                        <tbody>{''.join(rows_html)}</tbody>
                      </table>
                    </div>
                  </div>
                </details>
                """
            )
        category_metrics = category_summary(problems, candidate_impl, baseline_impl)
        category_tier = speedup_tier(category_metrics["median_speedup"])
        sections.append(
            f"""
            <details class="category-section" data-category="{escape(category).lower()}">
              <summary>
                <div>
                  <span class="eyebrow">Category</span>
                  <h1>{escape(category)}</h1>
                </div>
                <div class="category-actions">
                  <span class="speed-chip runtime-comparison {category_tier}" title="{runtime_tier_title(category_tier, candidate_impl, baseline_impl)}">{format_runtime_advantage(category_metrics["median_speedup"], candidate_impl)}</span>
                  {memory_delta_badge(category_metrics["median_memory_delta"])}
                  <strong>{len(problems)} problem{'s' if len(problems) != 1 else ''}</strong>
                </div>
              </summary>
              <div class="category-overview">
                {category_problem_bars(problems, specs, candidate_impl, baseline_impl)}
              </div>
              <div class="problem-grid">{''.join(problem_cards)}</div>
            </details>
            """
        )

    env_rows = "".join(
        f"<div><span>{escape(str(key))}</span><strong>{escape(str(value))}</strong></div>"
        for key, value in environment.items()
        if key != "problems"
    )
    available_impls = sorted_impls({row["impl"]: row for row in rows})
    legend_entries = "".join(
        f'<span><b style="background: {IMPL_COLORS.get(impl, "#475467")}"></b>{impl_label(impl)}</span>'
        for impl in available_impls
    )
    payload = json.dumps(json_safe({"rows": rows, "environment": environment}), indent=2).replace("</", "<\\/")
    html = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sifr LeetCode Benchmark Report</title>
  <style>
    :root {{
      --bg: #f6f7f9; --panel: #fff; --ink: #151923; --muted: #667085;
      --line: #dfe4eb; --teal: #a21caf; --blue: #3776ab; --indigo: #3776ab; --green: #3c873a;
      --rust: #f97316; --amber: #b45309; --red: #b91c1c; --soft: #f9fafb;
      --shadow: 0 18px 50px rgba(20, 26, 39, .08);
    }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; background: var(--bg); color: var(--ink); font: 14px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }}
    .shell {{ max-width: 1320px; margin: 0 auto; padding: 32px 24px 56px; }}
    .hero {{ background: var(--panel); border: 1px solid var(--line); border-radius: 8px; box-shadow: var(--shadow); padding: 28px; display: grid; grid-template-columns: 1.25fr .75fr; gap: 24px; align-items: end; }}
    .eyebrow {{ color: var(--teal); font-weight: 700; letter-spacing: .08em; text-transform: uppercase; font-size: 12px; margin: 0 0 8px; }}
    h1, h2, p {{ margin-top: 0; }}
    .hero h1 {{ font-size: 34px; line-height: 1.1; margin-bottom: 12px; letter-spacing: 0; }}
    .hero p {{ color: var(--muted); max-width: 760px; margin-bottom: 0; }}
    .stats {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }}
    .stat {{ border: 1px solid var(--line); border-radius: 8px; padding: 14px; background: var(--soft); }} .stat span {{ display: block; color: var(--muted); font-size: 12px; }} .stat strong {{ display: block; font-size: 25px; margin-top: 4px; }}
    .stat strong.strong, .stat strong.good, .stat strong.marginal {{ color: var(--green); }} .stat strong.neutral {{ color: var(--muted); }} .stat strong.regress {{ color: var(--red); }}
    .legend {{ display: flex; flex-wrap: wrap; gap: 10px 18px; margin-top: 18px; color: var(--muted); font-size: 13px; }} .legend span {{ display: inline-flex; align-items: center; gap: 7px; }} .legend b {{ width: 12px; height: 12px; border-radius: 4px; display: inline-block; }}
    .legend .py {{ background: var(--indigo); }} .legend .sf {{ background: var(--teal); }}
    .filter-bar {{ position: sticky; top: 0; z-index: 10; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; margin: 20px 0; padding: 12px; background: rgba(246, 247, 249, .94); backdrop-filter: blur(10px); border: 1px solid var(--line); border-radius: 8px; }}
    .filter-left {{ display: flex; flex-wrap: wrap; gap: 10px; align-items: center; min-width: min(100%, 520px); }}
    .filter-bar input[type="search"] {{ min-width: min(320px, 100%); border: 1px solid var(--line); border-radius: 8px; padding: 9px 11px; color: var(--ink); background: var(--panel); }}
    .compare-controls {{ display: inline-flex; flex-wrap: wrap; gap: 8px; align-items: center; border-left: 1px solid var(--line); padding-left: 10px; color: var(--muted); }}
    .compare-controls label {{ display: inline-flex; align-items: center; gap: 6px; font-weight: 700; }}
    .compare-controls select {{ border: 1px solid var(--line); border-radius: 8px; padding: 8px 28px 8px 10px; color: var(--ink); background: var(--panel); font-weight: 700; }}
    .filter-bar button {{ border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px; color: var(--ink); background: var(--panel); font-weight: 700; cursor: pointer; }}
    .filter-bar button:focus-visible, .filter-bar input:focus-visible, .filter-bar select:focus-visible, summary:focus-visible {{ outline: 2px solid var(--teal); outline-offset: 2px; }}
    .filters {{ display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }} .filters label {{ display: inline-flex; align-items: center; gap: 6px; color: var(--muted); }}
    .category-section {{ margin-top: 24px; background: var(--panel); border: 1px solid var(--line); border-radius: 8px; box-shadow: var(--shadow); overflow: hidden; }}
    .category-section > summary {{ list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 18px 22px; background: var(--soft); }}
    .category-section[open] > summary {{ border-bottom: 1px solid var(--line); }}
    .category-section > summary::-webkit-details-marker {{ display: none; }} .category-section h1 {{ font-size: 22px; margin-bottom: 0; }} .category-section summary strong {{ color: var(--muted); }}
    .category-actions {{ display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 10px; }}
    .category-overview {{ display: grid; gap: 14px; padding: 16px 22px; border-bottom: 1px solid var(--line); background: #fff; }}
    .category-bar {{ display: grid; grid-template-columns: minmax(160px, .8fr) minmax(210px, .9fr) minmax(300px, 1.2fr) minmax(300px, 1.2fr) auto; align-items: center; gap: 16px; color: var(--muted); }}
    .category-bar > span {{ color: var(--ink); font-weight: 800; }}
    .summary-metric {{ display: grid; gap: 7px; min-width: 0; }} .summary-metric + .summary-metric {{ border-left: 1px solid var(--line); padding-left: 16px; }} .metric-title {{ display: flex; align-items: center; justify-content: space-between; gap: 10px; }} .metric-title > span {{ color: var(--muted); font-size: 12px; font-weight: 800; text-transform: uppercase; }}
    .metadata-row {{ display: flex; gap: 7px; flex-wrap: wrap; align-items: center; }}
    .value-bars {{ display: grid; gap: 4px; }} .value-row {{ display: grid; grid-template-columns: 48px minmax(120px, 1fr) minmax(78px, auto); align-items: center; gap: 8px; font-size: 12px; }}
    .value-row span {{ color: var(--muted); font-weight: 700; text-align: right; }} .value-row strong {{ color: var(--ink); font-variant-numeric: tabular-nums; text-align: right; }} .value-row i {{ height: 8px; background: #e8edf4; border-radius: 999px; overflow: hidden; }} .value-row b {{ display: block; height: 100%; border-radius: inherit; }}
    .value-row.python b {{ background: var(--blue); }} .value-row.sifr b {{ background: var(--teal); }} .value-row.rust b {{ background: var(--rust); }} .value-row.nodejs b {{ background: var(--green); }}
    .problem-grid {{ display: grid; gap: 12px; padding: 16px 22px; }} .problem-card {{ background: var(--panel); border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }} .problem-card[hidden] {{ display: none; }}
    .problem-card > summary::-webkit-details-marker {{ display: none; }} .problem-card[open] {{ box-shadow: 0 10px 28px rgba(20, 26, 39, .06); }} .problem-body {{ border-top: 1px solid var(--line); }}
    .problem-heading {{ list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 18px; }}
    .problem-heading h2 {{ font-size: 20px; margin-bottom: 0; }} .problem-actions {{ display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }}
    .speed-chip {{ border-radius: 999px; padding: 6px 10px; font-weight: 800; background: #eef6f5; color: var(--teal); }}
    .speed-chip.strong, .speed-chip.good, .speed-chip.marginal {{ background: #ecfdf3; color: var(--green); }} .speed-chip.regress {{ background: #fef2f2; color: var(--red); }}
    .summary-badge {{ font-weight: 800; }} .summary-badge.strong, .summary-badge.good, .summary-badge.marginal {{ color: var(--green); }} .summary-badge.neutral {{ color: var(--muted); }} .summary-badge.regress {{ color: var(--red); }}
    .delta-badge {{ display: inline-flex; align-items: center; justify-content: center; min-width: 148px; white-space: nowrap; flex-shrink: 0; border-radius: 999px; padding: 5px 10px; font-weight: 800; font-size: 12px; }}
    .delta-badge.strong, .delta-badge.good {{ background: #ecfdf3; color: var(--green); }} .delta-badge.neutral {{ background: #f2f4f7; color: var(--muted); }} .delta-badge.regress {{ background: #fef2f2; color: var(--red); }}
    .visual-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 16px 18px; }}
    .chart-card {{ border: 1px solid var(--line); border-radius: 8px; background: var(--soft); padding: 14px; min-height: 344px; }}
    .chart-card > div:first-child {{ display: flex; justify-content: space-between; gap: 12px; color: var(--muted); margin-bottom: 10px; }} .chart-card strong {{ color: var(--ink); }} .axis-chart {{ width: 100%; height: 310px; display: block; }}
    .axis-chart .grid line {{ stroke: #dce3ec; stroke-width: 1; }} .axis-chart .axis {{ stroke: #8792a2; stroke-width: 1.2; }} .axis-chart .baseline {{ stroke: var(--amber); stroke-width: 1.4; stroke-dasharray: 5 5; }}
    .axis-chart .baseline-label {{ fill: var(--amber); font-size: 12px; font-weight: 700; }} .axis-chart .axis-label {{ fill: var(--muted); font-size: 12px; }} .axis-chart .axis-title {{ fill: #344054; font-size: 13px; font-weight: 700; }}
    .axis-chart .line {{ fill: none; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }}
    .axis-chart .line.sf {{ stroke: var(--teal); }} .axis-chart .line.py {{ stroke: var(--indigo); }} .axis-chart circle {{ fill: var(--panel); stroke-width: 2.4; }}
    .axis-chart .series circle {{ stroke: var(--impl-color); }} .axis-chart .legend-dot {{ fill: var(--impl-color); stroke: var(--impl-color); }}
    .axis-chart .series-sf circle, .axis-chart .legend-sf {{ stroke: var(--teal); }} .axis-chart .series-py circle, .axis-chart .legend-py {{ stroke: var(--indigo); }}
    .axis-chart .legend-py {{ fill: var(--indigo); }} .axis-chart .legend-sf {{ fill: var(--teal); }} .chart-legend text {{ fill: var(--muted); font-size: 12px; font-weight: 700; }}
    .chart-note {{ margin: -4px 0 0 104px; max-width: 520px; color: var(--muted); font-size: 12px; font-style: italic; }}
    .table-wrap {{ overflow-x: auto; }}
    table {{ width: 100%; border-collapse: collapse; min-width: 920px; }}
    th {{ color: var(--muted); font-size: 12px; text-align: left; font-weight: 700; padding: 12px 14px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: var(--soft); }}
    th small {{ display: block; font-weight: 600; color: #8a94a6; }} td {{ padding: 13px 14px; border-bottom: 1px solid var(--line); vertical-align: middle; white-space: nowrap; }} tr:last-child td {{ border-bottom: 0; }}
    .comparison-table tbody tr:not(.detail-row):nth-of-type(4n + 1) td {{ background: #fcfdff; }} .comparison-table tbody tr:not(.detail-row):hover td {{ background: #f8fafc; }}
    th:first-child, td:first-child {{ position: sticky; left: 0; z-index: 1; background: var(--panel); }} th:first-child {{ z-index: 3; background: var(--soft); }} .detail-row td:first-child {{ position: static; }}
    .comparison-table th:nth-child(4), .comparison-table td:nth-child(4) {{ border-left: 1px solid var(--line); }}
    .impl-legend-row th {{ padding-top: 8px; padding-bottom: 8px; border-top: 0; background: #fff; }} .impl-legend {{ display: flex; flex-wrap: wrap; gap: 10px 16px; color: var(--muted); font-size: 12px; }}
    .impl-legend span {{ display: inline-flex; align-items: center; gap: 6px; }} .impl-legend i, .metric-stack-row i {{ width: 8px; height: 8px; border-radius: 50%; background: var(--impl-color); display: inline-block; }}
    .metric-stack-cell {{ min-width: 150px; vertical-align: top; }} .metric-stack-row {{ display: grid; grid-template-columns: 38px minmax(74px, 1fr); align-items: baseline; gap: 10px; color: var(--impl-color); font-variant-numeric: tabular-nums; }}
    .metric-stack-row + .metric-stack-row {{ margin-top: 5px; }} .metric-stack-row span {{ display: inline-flex; align-items: center; gap: 6px; color: var(--muted); font-weight: 800; }} .metric-stack-row strong {{ text-align: right; color: var(--impl-color); }}
    .leader-cell {{ min-width: 170px; display: grid; gap: 7px; }} .leader-cell strong {{ font-size: 15px; }} .leader-cell strong.strong, .leader-cell strong.good, .leader-cell strong.marginal {{ color: var(--green); }} .leader-cell strong.regress {{ color: var(--red); }}
    .size-pill {{ display: inline-block; min-width: 84px; font-variant-numeric: tabular-nums; font-weight: 700; }}
    .speed-cell {{ min-width: 138px; display: grid; gap: 7px; }}
    .speed {{ font-size: 18px; }} .speed.strong, .speed.good, .speed.marginal {{ color: var(--green); }} .speed.regress {{ color: var(--red); }}
    .bar {{ display: block; width: 130px; height: 8px; border-radius: 999px; background: #e8edf4; overflow: hidden; }}
    .bar span {{ display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--teal), var(--blue)); }}
    .bar .strong, .bar .good {{ background: var(--green); }} .bar .marginal {{ background: var(--teal); }} .bar .regress {{ background: var(--red); }}
    .diagnostics summary {{ cursor: pointer; color: var(--muted); font-weight: 800; }} .diagnostics-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 12px; margin-top: 12px; }}
    .diagnostics section {{ border: 1px solid var(--line); border-left: 4px solid var(--impl-color); border-radius: 8px; padding: 10px 12px; background: var(--soft); }} .diagnostics h4 {{ display: flex; align-items: center; gap: 8px; margin: 0 0 8px; color: var(--impl-color); }}
    .diagnostics dl {{ display: grid; grid-template-columns: auto 1fr; gap: 5px 12px; margin: 0; }} .diagnostics dt {{ color: var(--muted); }} .diagnostics dd {{ margin: 0; font-weight: 700; font-variant-numeric: tabular-nums; }} .impl-dot {{ width: 9px; height: 9px; border-radius: 50%; background: var(--impl-color); }}
    .variance-dot {{ width: 10px; height: 10px; display: inline-block; border-radius: 50%; margin-right: 7px; background: var(--green); }} .variance-dot.noisy {{ background: var(--amber); }} .empty-chart {{ color: var(--muted); }}
    .meta-panel {{ margin-top: 24px; background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 18px 22px; }}
    .category-language-grid {{ grid-template-columns: 1fr; padding: 0; }}
    .category-language-card {{ background: var(--soft); min-height: 500px; }}
    .category-matrix-plot {{ overflow-x: auto; padding-bottom: 4px; }}
    .category-language-card .axis-chart {{ height: 430px; min-width: 1040px; }}
    .category-axis-label {{ font-size: 10px; }}
    .category-chart-legend text {{ font-weight: 800; fill: var(--muted); }}
    .meta-grid {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 18px; }} .meta-grid div {{ display: flex; justify-content: space-between; gap: 16px; border-bottom: 1px solid var(--line); padding-bottom: 8px; }}
    .footnote {{ color: var(--muted); margin: 14px 0 0; font-size: 12px; max-width: 940px; }}
    .meta-grid span {{ color: var(--muted); }} footer {{ color: var(--muted); margin-top: 22px; font-size: 12px; }}
    {metadata_styles()}
    @media (max-width: 920px) {{ .shell {{ padding: 20px 12px 40px; }} .hero, .visual-grid {{ grid-template-columns: 1fr; }} .hero {{ padding: 20px; }} .stats, .meta-grid {{ grid-template-columns: 1fr; }} .problem-heading, .category-section > summary {{ align-items: flex-start; flex-direction: column; }} .category-actions, .problem-actions {{ justify-content: flex-start; }} .category-bar {{ grid-template-columns: 1fr; align-items: start; }} .filter-bar {{ position: static; }} .compare-controls {{ border-left: 0; padding-left: 0; }} }}
  </style>
</head>
<body>
  <main class="shell">
    <section class="hero">
      <div>
        <p class="eyebrow">Sifr Benchmark Report</p>
        <h1 id="hero-title">Runtime: {format_runtime_advantage(stats["median_speedup"])} · Memory: {format_memory_advantage(stats["median_memory_delta"])}</h1>
        <p id="hero-copy">Hyperfine results for selected implementations. Summary speedup metrics default to Sifr/Python apples-to-apples continuity; use the comparison controls to choose any measured language pair.</p>
        <div class="legend">
          {legend_entries}
          <span><span class="variance-dot stable"></span>stable</span>
          <span><span class="variance-dot noisy"></span>noisy</span>
        </div>
      </div>
      <div class="stats">
        <div class="stat"><span>Problems</span><strong>{stats["problems"]}</strong></div>
        <div class="stat"><span>Categories</span><strong>{stats["categories"]}</strong></div>
        <div class="stat"><span>Median Runtime</span><strong id="stat-median-runtime" class="{speedup_tier(stats['median_speedup'])}">{format_runtime_advantage(stats["median_speedup"])}</strong></div>
        <div class="stat"><span>Median Peak RSS</span><strong id="stat-median-memory" class="{delta_tier(stats['median_memory_delta'])}">{format_memory_advantage(stats["median_memory_delta"])}</strong></div>
        <div class="stat"><span>Mean Runtime</span><strong id="stat-mean-runtime" class="{speedup_tier(stats['average_speedup'])}">{format_runtime_advantage(stats["average_speedup"])}</strong></div>
        <div class="stat"><span>Reliable Comparisons</span><strong id="stat-reliable">{stats["stable_pairs"]}/{stats["comparisons"]}</strong></div>
      </div>
    </section>
    <section class="filter-bar" aria-label="Report filters">
      <div class="filter-left">
        <input id="problem-search" type="search" placeholder="Filter by problem or category">
        <div class="compare-controls" aria-label="Language comparison">
          <label>Compare <select id="compare-candidate"></select></label>
          <span>vs</span>
          <label><select id="compare-baseline"></select></label>
        </div>
      </div>
      <div class="filters">
        <button type="button" id="expand-all">Expand all</button>
        <button type="button" id="collapse-all">Collapse all</button>
        <label><input type="checkbox" data-tier-filter="regress" checked> regress</label>
        <label><input type="checkbox" data-tier-filter="marginal" checked> marginal</label>
        <label><input type="checkbox" data-tier-filter="good" checked> good</label>
        <label><input type="checkbox" data-tier-filter="strong" checked> strong</label>
        <label><input id="stable-only" type="checkbox"> stable only</label>
      </div>
    </section>
    {category_language_overview(rows)}
    {''.join(sections)}
    <section class="meta-panel">
      <p class="eyebrow">Run Environment</p>
      <div class="meta-grid">{env_rows}</div>
      <p class="footnote">Speedup is computed only when Python and Sifr operation counts match. Throughput is problem-specific because each problem has its own operation shape. Runtime values come from hyperfine; memory values come from separate /usr/bin/time RSS samples and should be treated as process-level memory, not language heap allocation.</p>
    </section>
    <footer>Generated {escape(generated_at)} from benchmark JSON exports in <code>benchmarks/results/.raw</code>.</footer>
  </main>
  <script type="application/json" id="benchmark-data">{payload}</script>
  <script>{report_script()}</script>
</body>
</html>
"""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html, encoding="utf-8")
    print(f"wrote {output_path}")
