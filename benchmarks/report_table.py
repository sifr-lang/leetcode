from __future__ import annotations

from typing import Any

from report_format import format_fold


IMPL_LABELS = {"python": "Python", "sifr": "Sifr", "nodejs": "Node.js", "node": "Node.js", "bun": "Bun", "rust": "Rust"}
IMPL_SHORT_LABELS = {"python": "Py", "sifr": "Sf", "nodejs": "No", "node": "No", "bun": "Bu", "rust": "Rs"}
IMPL_COLORS = {"python": "#4f46e5", "sifr": "#0f766e", "nodejs": "#15803d", "node": "#15803d", "bun": "#b45309", "rust": "#b91c1c"}
IMPL_ORDER = {"python": 0, "sifr": 1, "rust": 2, "nodejs": 3, "node": 3, "bun": 4}
RUNTIME_TITLES = {"strong": "Strong: at least 3x faster than Python", "good": "Good: at least 2x faster than Python", "marginal": "Marginal: faster than Python, but under 2x", "regress": "Regression: slower than Python", "neutral": "No runtime comparison"}
MEMORY_TITLES = {"strong": "Strong: at least 10% less peak RSS than Python", "good": "Good: at least 2% less peak RSS than Python", "neutral": "Neutral: peak RSS differs by less than 2%", "regress": "Regression: more peak RSS than Python"}


def format_ms(value: float | None) -> str:
    if value is None:
        return "n/a"
    return f"{value / 1000:.2f}s" if value >= 1000 else f"{value:.1f}ms"


def format_rate(value: float | None) -> str:
    if value is None:
        return "n/a"
    if value >= 1_000_000:
        return f"{value / 1_000_000:.2f}M/s"
    return f"{value / 1_000:.1f}K/s" if value >= 1_000 else f"{value:.0f}/s"


def format_memory(value: float | None) -> str:
    return "n/a" if value is None else f"{value:.1f} MB"


def format_ns(value: float | None) -> str:
    if value is None:
        return "n/a"
    return f"{value / 1_000:.2f} us/op" if value >= 1_000 else f"{value:.1f} ns/op"


def format_cv(value: float | None) -> str:
    return "n/a" if value is None else f"{value * 100:.1f}%"


def speedup_tier(speedup: float | None) -> str:
    if speedup is None:
        return "neutral"
    if speedup >= 3:
        return "strong"
    if speedup >= 2:
        return "good"
    return "marginal" if speedup >= 1 else "regress"


def delta_tier(value: float | None) -> str:
    if value is None:
        return "neutral"
    if value >= 0.10:
        return "strong"
    if value >= 0.02:
        return "good"
    return "neutral" if value > -0.02 else "regress"


def impl_label(impl: str) -> str:
    return IMPL_LABELS.get(impl, impl.replace("_", " ").title())


def impl_short_label(impl: str) -> str:
    return IMPL_SHORT_LABELS.get(impl, impl[:2].title())


def impl_style(impl: str) -> str:
    return f'--impl-color: {IMPL_COLORS.get(impl, "#475467")}'


def sorted_impls(impls: dict[str, dict[str, Any]]) -> list[str]:
    return sorted(impls, key=lambda impl: (IMPL_ORDER.get(impl, 99), impl))


def best_runtime_for_impls(impls: dict[str, dict[str, Any]]) -> tuple[str, float] | None:
    baseline = impls.get("python")
    if not baseline:
        return None
    candidates = [(impl, baseline["mean_ms"] / row["mean_ms"]) for impl, row in impls.items() if impl != "python" and row["mean_ms"] > 0 and row["operations"] == baseline["operations"]]
    return max(candidates, key=lambda item: item[1]) if candidates else None


def best_memory_for_impls(impls: dict[str, dict[str, Any]]) -> tuple[str, float] | None:
    baseline = impls.get("python")
    base_memory = baseline.get("peak_memory_mb") if baseline else None
    if base_memory is None or base_memory <= 0:
        return None
    candidates = [(impl, (base_memory - memory) / base_memory) for impl, row in impls.items() if impl != "python" and (memory := row.get("peak_memory_mb")) is not None]
    return max(candidates, key=lambda item: item[1]) if candidates else None


def runtime_leader_cell(impls: dict[str, dict[str, Any]], max_speedup: float) -> str:
    winner = best_runtime_for_impls(impls)
    if winner is None:
        return '<span class="empty-chart">n/a</span>'
    impl, speedup = winner
    tier = speedup_tier(speedup)
    width = min(100.0, max(4.0, (speedup / max_speedup) * 100.0))
    direction = "faster" if speedup >= 1 else "slower"
    value = speedup if speedup >= 1 else 1 / speedup
    return f'<div class="leader-cell"><strong class="{tier}" title="{RUNTIME_TITLES[tier]}">{impl_label(impl)} {format_fold(value)} {direction}</strong><span class="bar"><span class="{tier}" style="width: {width:.1f}%"></span></span></div>'


def memory_leader_cell(impls: dict[str, dict[str, Any]]) -> str:
    winner = best_memory_for_impls(impls)
    if winner is None:
        return f'<span class="delta-badge neutral" title="{MEMORY_TITLES["neutral"]}">Memory: n/a</span>'
    impl, delta = winner
    tier = delta_tier(delta)
    text = f"Memory: {impl_label(impl)} about equal" if abs(delta) < 0.02 else f'Memory: {impl_label(impl)} {abs(delta) * 100:.0f}% {"less" if delta > 0 else "more"}'
    return f'<span class="delta-badge {tier}" title="{MEMORY_TITLES[tier]}">{text}</span>'


def metric_stack_cell(
    impls: dict[str, dict[str, Any]],
    impl_names: list[str],
    key: str,
    formatter: Any,
) -> str:
    items = []
    for impl in impl_names:
        row = impls.get(impl)
        value = formatter(row.get(key) if row else None)
        items.append(f'<div class="metric-stack-row" style="{impl_style(impl)}"><span><i></i>{impl_short_label(impl)}</span><strong>{value}</strong></div>')
    return f'<td class="metric-stack-cell">{"".join(items)}</td>'


def core_metric_cells(impls: dict[str, dict[str, Any]], impl_names: list[str]) -> str:
    return "".join(
        [
            metric_stack_cell(impls, impl_names, "mean_ms", format_ms),
            metric_stack_cell(impls, impl_names, "time_per_op_ns", format_ns),
            metric_stack_cell(impls, impl_names, "peak_memory_mb", format_memory),
        ]
    )


def diagnostics_block(impls: dict[str, dict[str, Any]], impl_names: list[str]) -> str:
    panels = []
    for impl in impl_names:
        row = impls.get(impl)
        if row:
            cpu = f'{format_ms(row["user_ms"])} / {format_ms(row["system_ms"])}'
            panels.append(f'<section style="{impl_style(impl)}"><h4><span class="impl-dot"></span>{impl_label(impl)}</h4><dl><dt>Median</dt><dd>{format_ms(row.get("median_ms"))}</dd><dt>Range</dt><dd>{format_ms(row["min_ms"])} to {format_ms(row["max_ms"])}</dd><dt>Stddev</dt><dd>{format_ms(row.get("stddev_ms"))}</dd><dt>CPU user / system</dt><dd>{cpu}</dd><dt>Throughput</dt><dd>{format_rate(row.get("throughput_per_s"))}</dd><dt>CV</dt><dd>{format_cv(row.get("cv"))}</dd><dt>Variance</dt><dd><span class="variance-dot {row["verdict"]}"></span>{row["verdict"]}</dd></dl></section>')
    return f'<details class="diagnostics"><summary>Diagnostics</summary><div class="diagnostics-grid">{"".join(panels)}</div></details>'


def comparison_rows(size: int, impls: dict[str, dict[str, Any]], impl_names: list[str], max_speedup: float) -> str:
    winner = best_runtime_for_impls(impls)
    tier = speedup_tier(winner[1] if winner else None)
    verdict = "noisy" if any(row["verdict"] == "noisy" for row in impls.values()) else "stable"
    colspan = 6
    valid = "yes" if winner is not None else "no"
    main = f'<tr data-tier="{tier}" data-verdict="{verdict}" data-valid="{valid}"><td><span class="size-pill">{size:,}</span></td><td>{runtime_leader_cell(impls, max_speedup)}</td><td>{memory_leader_cell(impls)}</td>{core_metric_cells(impls, impl_names)}</tr>'
    return f'{main}<tr class="detail-row"><td colspan="{colspan}">{diagnostics_block(impls, impl_names)}</td></tr>'


def comparison_header(impl_names: list[str]) -> str:
    legend = "".join(f'<span style="{impl_style(impl)}"><i></i>{impl_short_label(impl)} = {impl_label(impl)}</span>' for impl in impl_names)
    return f'<thead><tr><th>Input</th><th>Runtime lead</th><th>Memory lead</th><th>Mean</th><th>Time/op</th><th>Peak RSS</th></tr><tr class="impl-legend-row"><th colspan="6"><div class="impl-legend">{legend}</div></th></tr></thead>'
