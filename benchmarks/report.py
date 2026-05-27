from __future__ import annotations

import json
import math
import statistics
import time
from html import escape
from pathlib import Path
from typing import Any


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


def report_stats(rows: list[dict[str, Any]]) -> dict[str, Any]:
    pair_speedups = []
    problem_ids = set()
    categories = set()
    stable_pairs = 0
    total_pairs = 0
    for category, problems in grouped_report_rows(rows).items():
        categories.add(category)
        for problem_id, sizes in problems.items():
            problem_ids.add(problem_id)
            for impls in sizes.values():
                python = impls.get("python")
                sifr = impls.get("sifr")
                if python and sifr and sifr["mean_ms"] > 0:
                    pair_speedups.append(python["mean_ms"] / sifr["mean_ms"])
                    total_pairs += 1
                    if python["verdict"] == "stable" and sifr["verdict"] == "stable":
                        stable_pairs += 1
    return {
        "categories": len(categories),
        "problems": len(problem_ids),
        "comparisons": total_pairs,
        "stable_pairs": stable_pairs,
        "average_speedup": statistics.mean(pair_speedups) if pair_speedups else None,
        "median_speedup": statistics.median(pair_speedups) if pair_speedups else None,
        "max_speedup": max(pair_speedups) if pair_speedups else None,
    }


def speedup_tier(speedup: float | None) -> str:
    if speedup is None:
        return "neutral"
    if speedup >= 3:
        return "strong"
    if speedup >= 2:
        return "good"
    if speedup >= 1:
        return "watch"
    return "regress"


def format_cv(value: float | None) -> str:
    if value is None:
        return "n/a"
    return f"{value * 100:.1f}%"


def format_number(value: float | None) -> str:
    if value is None:
        return "n/a"
    return f"{value:,.0f}"


def speedup_for_impls(impls: dict[str, dict[str, Any]]) -> float | None:
    python = impls.get("python")
    sifr = impls.get("sifr")
    if not python or not sifr or sifr["mean_ms"] <= 0:
        return None
    if python["operations"] != sifr["operations"]:
        return None
    return python["mean_ms"] / sifr["mean_ms"]


def speedups_for_sizes(sizes: dict[int, dict[str, dict[str, Any]]]) -> list[tuple[int, float]]:
    pairs = []
    for size, impls in sorted(sizes.items()):
        speedup = speedup_for_impls(impls)
        if speedup is not None:
            pairs.append((size, speedup))
    return pairs


def problem_summary(sizes: dict[int, dict[str, dict[str, Any]]]) -> dict[str, Any]:
    speedups = [speedup for _, speedup in speedups_for_sizes(sizes)]
    noisy = False
    for impls in sizes.values():
        python = impls.get("python")
        sifr = impls.get("sifr")
        if (python and python["verdict"] == "noisy") or (sifr and sifr["verdict"] == "noisy"):
            noisy = True
    return {
        "median_speedup": statistics.median(speedups) if speedups else None,
        "max_speedup": max(speedups) if speedups else 1.0,
        "noisy": noisy,
    }


def dual_metric(
    python: dict[str, Any] | None,
    sifr: dict[str, Any] | None,
    key: str,
    formatter: Any,
) -> str:
    return f"""
    <div class="metric-pair">
      <span class="metric-value py">{formatter(python[key] if python else None)}</span>
      <span class="metric-divider">/</span>
      <span class="metric-value sf">{formatter(sifr[key] if sifr else None)}</span>
    </div>
    """


def cpu_metric(python: dict[str, Any] | None, sifr: dict[str, Any] | None) -> str:
    py = f"{format_ms(python['user_ms'])} / {format_ms(python['system_ms'])}" if python else "n/a"
    sf = f"{format_ms(sifr['user_ms'])} / {format_ms(sifr['system_ms'])}" if sifr else "n/a"
    return f"""
    <div class="metric-pair wide">
      <span class="metric-value py">{py}</span>
      <span class="metric-divider">/</span>
      <span class="metric-value sf">{sf}</span>
    </div>
    """


def range_metric(python: dict[str, Any] | None, sifr: dict[str, Any] | None) -> str:
    py = f"{format_ms(python['min_ms'])} to {format_ms(python['max_ms'])}" if python else "n/a"
    sf = f"{format_ms(sifr['min_ms'])} to {format_ms(sifr['max_ms'])}" if sifr else "n/a"
    return f"""
    <div class="metric-pair wide">
      <span class="metric-value py">{py}</span>
      <span class="metric-divider">/</span>
      <span class="metric-value sf">{sf}</span>
    </div>
    """


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
) -> dict[str, list[tuple[int, float]]]:
    points: dict[str, list[tuple[int, float]]] = {"python": [], "sifr": []}
    for size, impls in sorted(sizes.items()):
        for impl in ("python", "sifr"):
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
    overlap_tolerance: float | None = None,
    overlap_note: str | None = None,
) -> str:
    points = collect_metric_points(sizes, key)
    all_points = points["python"] + points["sifr"]
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
        for size, python_value in values_by_impl["python"].items():
            sifr_value = values_by_impl["sifr"].get(size)
            if sifr_value is None:
                continue
            denominator = max(abs(python_value), abs(sifr_value), 1.0)
            if abs(python_value - sifr_value) / denominator <= overlap_tolerance:
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

    def series(impl: str) -> tuple[str, str]:
        offset = -3.0 if impl == "python" else 3.0
        coordinates = [
            (x_positions[size], y_pos(value) + (offset if size in overlap_sizes else 0.0))
            for size, value in points[impl]
        ]
        circles = "".join(
            f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4"><title>{impl}: {y_formatter(value)}</title></circle>'
            for (size, value), (x, y) in zip(points[impl], coordinates, strict=True)
        )
        return svg_points(coordinates), circles

    python_line, python_circles = series("python")
    sifr_line, sifr_circles = series("sifr")
    note = ""
    if overlap_sizes and overlap_note:
        note = f'<p class="chart-note">{escape(overlap_note)}</p>'
    return f"""
    <svg class="axis-chart {chart_class}" viewBox="0 0 {width} {height}" role="img" aria-label="{escape(aria_label)}">
      <g class="grid">{''.join(grid)}{x_grid}</g>
      <line class="axis" x1="{left}" y1="{top}" x2="{left}" y2="{height - bottom}"></line>
      <line class="axis" x1="{left}" y1="{height - bottom}" x2="{width - right}" y2="{height - bottom}"></line>
      <polyline class="line py" points="{python_line}"></polyline>
      <g class="series-py">{python_circles}</g>
      <polyline class="line sf" points="{sifr_line}"></polyline>
      <g class="series-sf">{sifr_circles}</g>
      {x_ticks}
      <g class="chart-legend" transform="translate({width - 178} 24)">
        <circle class="legend-py" cx="0" cy="0" r="4"></circle><text x="10" y="4">Python</text>
        <circle class="legend-sf" cx="82" cy="0" r="4"></circle><text x="92" y="4">Sifr</text>
      </g>
      <text class="axis-title" x="{left + plot_width / 2:.1f}" y="{height - 8}" text-anchor="middle">Input size (log scale)</text>
      <text class="axis-title" transform="rotate(-90 20 {top + plot_height / 2:.1f})" x="20" y="{top + plot_height / 2:.1f}" text-anchor="middle">{escape(y_axis_title)}</text>
    </svg>
    {note}
    """


def speedup_bar(speedup: float | None, max_speedup: float) -> str:
    tier = speedup_tier(speedup)
    if speedup is None:
        return '<span class="empty-chart">n/a</span>'
    width = min(100.0, max(4.0, (speedup / max_speedup) * 100.0))
    return f"""
    <div class="speed-cell">
      <strong class="speed {tier}">{speedup:.2f}x</strong>
      <span class="bar"><span class="{tier}" style="width: {width:.1f}%"></span></span>
    </div>
    """


def category_problem_bars(problems: dict[str, dict[int, dict[str, dict[str, Any]]]]) -> str:
    summaries = []
    max_speedup = 1.0
    for problem_id, sizes in problems.items():
        summary = problem_summary(sizes)
        median = summary["median_speedup"]
        if median is not None:
            max_speedup = max(max_speedup, median)
        summaries.append((problem_id, median, summary))
    summaries.sort(key=lambda item: (item[1] is None, -(item[1] or 0.0), item[0]))
    bars = []
    for problem_id, median, summary in summaries:
        tier = speedup_tier(median)
        width = min(100.0, ((median or 0.0) / max_speedup) * 100.0)
        bars.append(
            f"""
            <div class="category-bar" data-tier="{tier}">
              <span>{escape(problem_id)}</span>
              <i><b class="{tier}" style="width: {width:.1f}%"></b></i>
              <strong>{f"{median:.2f}x" if median else "n/a"}</strong>
              <em class="variance-dot {'noisy' if summary['noisy'] else 'stable'}"></em>
            </div>
            """
        )
    return "".join(bars)


def comparison_row(size: int, impls: dict[str, dict[str, Any]], max_speedup: float) -> str:
    python = impls.get("python")
    sifr = impls.get("sifr")
    speedup = speedup_for_impls(impls)
    tier = speedup_tier(speedup)
    verdict = "stable"
    if (python and python["verdict"] == "noisy") or (sifr and sifr["verdict"] == "noisy"):
        verdict = "noisy"
    valid = "yes" if speedup is not None else "no"
    return f"""
    <tr data-tier="{tier}" data-verdict="{verdict}" data-valid="{valid}">
      <td><span class="size-pill">{size:,}</span></td>
      <td>{speedup_bar(speedup, max_speedup)}</td>
      <td>{dual_metric(python, sifr, "mean_ms", format_ms)}</td>
      <td>{dual_metric(python, sifr, "median_ms", format_ms)}</td>
      <td>{range_metric(python, sifr)}</td>
      <td>{dual_metric(python, sifr, "stddev_ms", format_ms)}</td>
      <td>{cpu_metric(python, sifr)}</td>
      <td>{dual_metric(python, sifr, "time_per_op_ns", format_ns)}</td>
      <td>{dual_metric(python, sifr, "throughput_per_s", format_rate)}</td>
      <td>{dual_metric(python, sifr, "peak_memory_mb", format_memory)}</td>
      <td>{dual_metric(python, sifr, "cv", format_cv)}</td>
      <td><span class="variance-dot {verdict}"></span>{verdict}</td>
    </tr>
    """


def render_html_report(
    problem_ids: list[str],
    output_path: Path,
    specs: dict[str, Any],
    results_dir: Path,
) -> None:
    rows = collect_summary_rows(problem_ids, specs, results_dir)
    if not rows:
        raise SystemExit("no benchmark results found; run `python3 benchmarks/bench.py run` first")
    stats = report_stats(rows)
    grouped = grouped_report_rows(rows)
    generated_at = time.strftime("%Y-%m-%d %H:%M:%S %Z")
    environment_path = results_dir / "environment.json"
    environment = json.loads(environment_path.read_text(encoding="utf-8")) if environment_path.exists() else {}

    sections = []
    for category, problems in grouped.items():
        problem_cards = []
        for problem_id, sizes in problems.items():
            spec = specs[problem_id]
            summary = problem_summary(sizes)
            rows_html = [
                comparison_row(size, impls, summary["max_speedup"])
                for size, impls in sorted(sizes.items())
            ]
            tier = speedup_tier(summary["median_speedup"])
            problem_cards.append(
                f"""
                <article class="problem-card" data-problem="{escape(problem_id)}" data-tier="{tier}" data-verdict="{'noisy' if summary['noisy'] else 'stable'}">
                  <div class="problem-heading">
                    <div>
                      <p class="eyebrow">{escape(spec.category)}</p>
                      <h2>{escape(problem_id)}</h2>
                    </div>
                    <div class="problem-actions">
                      <span class="speed-chip {tier}">{f"{summary['median_speedup']:.2f}x median" if summary["median_speedup"] else "n/a"}</span>
                      <span class="function-chip">{escape(spec.function)}</span>
                    </div>
                  </div>
                  <div class="visual-grid">
                    <div class="chart-card">
                      <div>
                        <span>Mean runtime vs input size</span>
                        <strong>{metric_range_label(sizes, "mean_ms", format_axis_ms)}</strong>
                      </div>
                      {dual_line_chart(
                          sizes,
                          key="mean_ms",
                          chart_class="runtime-chart",
                          aria_label="Mean runtime versus input size",
                          y_axis_title="Mean runtime (log scale)",
                          y_formatter=format_axis_ms,
                          log_y=True,
                      )}
                    </div>
                    <div class="chart-card">
                      <div>
                        <span>Peak RSS vs input size</span>
                        <strong>{metric_range_label(sizes, "peak_memory_mb", format_axis_memory)}</strong>
                      </div>
                      {dual_line_chart(
                          sizes,
                          key="peak_memory_mb",
                          chart_class="memory-chart",
                          aria_label="Peak RSS versus input size",
                          y_axis_title="Peak RSS (MB, linear scale)",
                          y_formatter=format_axis_memory,
                          log_y=False,
                          overlap_tolerance=0.01,
                          overlap_note="Python and Sifr RSS are within measurement noise; lines are separated slightly for visibility.",
                      )}
                    </div>
                  </div>
                  <div class="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Input</th>
                          <th>Speedup</th>
                          <th>Mean<br><small>Py / Sifr</small></th>
                          <th>Median<br><small>Py / Sifr</small></th>
                          <th>Min to Max<br><small>Py / Sifr</small></th>
                          <th>Stddev<br><small>Py / Sifr</small></th>
                          <th>CPU User / System<br><small>Py / Sifr</small></th>
                          <th>Time/op<br><small>Py / Sifr</small></th>
                          <th>Throughput<br><small>Py / Sifr</small></th>
                          <th>Peak RSS<br><small>Py / Sifr</small></th>
                          <th>CV<br><small>Py / Sifr</small></th>
                          <th>Variance</th>
                        </tr>
                      </thead>
                      <tbody>{''.join(rows_html)}</tbody>
                    </table>
                  </div>
                </article>
                """
            )
        sections.append(
            f"""
            <details class="category-section" open>
              <summary>
                <div>
                  <span class="eyebrow">Category</span>
                  <h1>{escape(category)}</h1>
                </div>
                <strong>{len(problems)} problem{'s' if len(problems) != 1 else ''}</strong>
              </summary>
              <div class="category-overview">
                {category_problem_bars(problems)}
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
    payload = json.dumps({"rows": rows, "environment": environment}, indent=2)
    html = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sifr LeetCode Benchmark Report</title>
  <style>
    :root {{
      --bg: #f6f7f9; --panel: #fff; --ink: #151923; --muted: #667085;
      --line: #dfe4eb; --teal: #0f766e; --blue: #2563eb; --indigo: #4f46e5; --green: #15803d;
      --amber: #b45309; --red: #b91c1c; --soft: #f9fafb;
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
    .stat {{ border: 1px solid var(--line); border-radius: 8px; padding: 14px; background: var(--soft); }}
    .stat span {{ display: block; color: var(--muted); font-size: 12px; }}
    .stat strong {{ display: block; font-size: 25px; margin-top: 4px; }}
    .legend {{ display: flex; flex-wrap: wrap; gap: 10px 18px; margin-top: 18px; color: var(--muted); font-size: 13px; }}
    .legend span {{ display: inline-flex; align-items: center; gap: 7px; }}
    .legend b {{ width: 12px; height: 12px; border-radius: 4px; display: inline-block; }}
    .legend .py {{ background: var(--indigo); }} .legend .sf {{ background: var(--teal); }}
    .filter-bar {{ position: sticky; top: 0; z-index: 10; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; margin: 20px 0; padding: 12px; background: rgba(246, 247, 249, .94); backdrop-filter: blur(10px); border: 1px solid var(--line); border-radius: 8px; }}
    .filter-bar input[type="search"] {{ min-width: min(320px, 100%); border: 1px solid var(--line); border-radius: 8px; padding: 9px 11px; color: var(--ink); background: var(--panel); }}
    .filters {{ display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }}
    .filters label {{ display: inline-flex; align-items: center; gap: 6px; color: var(--muted); }}
    .category-section {{ margin-top: 24px; background: var(--panel); border: 1px solid var(--line); border-radius: 8px; box-shadow: var(--shadow); overflow: hidden; }}
    .category-section > summary {{ list-style: none; cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 18px 22px; background: var(--soft); border-bottom: 1px solid var(--line); }}
    .category-section > summary::-webkit-details-marker {{ display: none; }}
    .category-section h1 {{ font-size: 22px; margin-bottom: 0; }}
    .category-section summary strong {{ color: var(--muted); }}
    .category-overview {{ display: grid; gap: 8px; padding: 16px 22px; border-bottom: 1px solid var(--line); background: #fff; }}
    .category-bar {{ display: grid; grid-template-columns: minmax(150px, 1fr) minmax(120px, 260px) auto auto; align-items: center; gap: 12px; color: var(--muted); }}
    .category-bar > span {{ color: var(--ink); font-weight: 700; }}
    .category-bar i {{ height: 9px; background: #e8edf4; border-radius: 999px; overflow: hidden; }}
    .category-bar b {{ display: block; height: 100%; border-radius: inherit; background: var(--teal); }}
    .category-bar b.strong {{ background: var(--green); }} .category-bar b.watch {{ background: var(--amber); }} .category-bar b.regress {{ background: var(--red); }}
    .problem-grid {{ display: grid; gap: 18px; }}
    .problem-card {{ background: var(--panel); border-top: 1px solid var(--line); overflow: hidden; }}
    .problem-card[hidden] {{ display: none; }}
    .problem-heading {{ display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 22px 12px; }}
    .problem-heading h2 {{ font-size: 20px; margin-bottom: 0; }}
    .problem-actions {{ display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }}
    .function-chip {{ border: 1px solid var(--line); color: var(--muted); border-radius: 999px; padding: 6px 10px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }}
    .speed-chip {{ border-radius: 999px; padding: 6px 10px; font-weight: 800; background: #eef6f5; color: var(--teal); }}
    .speed-chip.strong {{ background: #ecfdf3; color: var(--green); }} .speed-chip.watch {{ background: #fffbeb; color: var(--amber); }} .speed-chip.regress {{ background: #fef2f2; color: var(--red); }}
    .visual-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 0 22px 18px; }}
    .chart-card {{ border: 1px solid var(--line); border-radius: 8px; background: var(--soft); padding: 14px; min-height: 344px; }}
    .chart-card > div:first-child {{ display: flex; justify-content: space-between; gap: 12px; color: var(--muted); margin-bottom: 10px; }}
    .chart-card strong {{ color: var(--ink); }}
    .axis-chart {{ width: 100%; height: 310px; display: block; }}
    .axis-chart .grid line {{ stroke: #dce3ec; stroke-width: 1; }}
    .axis-chart .axis {{ stroke: #8792a2; stroke-width: 1.2; }}
    .axis-chart .baseline {{ stroke: var(--amber); stroke-width: 1.4; stroke-dasharray: 5 5; }}
    .axis-chart .baseline-label {{ fill: var(--amber); font-size: 12px; font-weight: 700; }}
    .axis-chart .axis-label {{ fill: var(--muted); font-size: 12px; }}
    .axis-chart .axis-title {{ fill: #344054; font-size: 13px; font-weight: 700; }}
    .axis-chart .line {{ fill: none; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }}
    .axis-chart .line.sf {{ stroke: var(--teal); }}
    .axis-chart .line.py {{ stroke: var(--indigo); }}
    .axis-chart circle {{ fill: var(--panel); stroke-width: 2.4; }}
    .axis-chart .series-sf circle, .axis-chart .legend-sf {{ stroke: var(--teal); }}
    .axis-chart .series-py circle, .axis-chart .legend-py {{ stroke: var(--indigo); }}
    .axis-chart .legend-py {{ fill: var(--indigo); }}
    .axis-chart .legend-sf {{ fill: var(--teal); }}
    .chart-legend text {{ fill: var(--muted); font-size: 12px; font-weight: 700; }}
    .chart-note {{ margin: -4px 0 0 104px; max-width: 520px; color: var(--muted); font-size: 12px; font-style: italic; }}
    .table-wrap {{ overflow-x: auto; }}
    table {{ width: 100%; border-collapse: collapse; min-width: 1540px; }}
    th {{ color: var(--muted); font-size: 12px; text-align: left; font-weight: 700; padding: 12px 14px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: var(--soft); }}
    th small {{ display: block; font-weight: 600; color: #8a94a6; }}
    td {{ padding: 13px 14px; border-bottom: 1px solid var(--line); vertical-align: middle; white-space: nowrap; }}
    tr:last-child td {{ border-bottom: 0; }}
    .size-pill {{ display: inline-block; min-width: 84px; font-variant-numeric: tabular-nums; font-weight: 700; }}
    .speed-cell {{ min-width: 138px; display: grid; gap: 7px; }}
    .speed {{ font-size: 18px; }} .speed.strong {{ color: var(--green); }} .speed.good {{ color: var(--teal); }} .speed.watch {{ color: var(--amber); }} .speed.regress {{ color: var(--red); }}
    .bar {{ display: block; width: 130px; height: 8px; border-radius: 999px; background: #e8edf4; overflow: hidden; }}
    .bar span {{ display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--teal), var(--blue)); }}
    .bar .strong {{ background: var(--green); }} .bar .watch {{ background: var(--amber); }} .bar .regress {{ background: var(--red); }}
    .metric-pair {{ display: grid; grid-template-columns: minmax(64px, 1fr) auto minmax(64px, 1fr); align-items: center; gap: 6px; min-width: 150px; font-variant-numeric: tabular-nums; }}
    .metric-pair.wide {{ min-width: 230px; }}
    .metric-value {{ overflow: hidden; text-overflow: ellipsis; }}
    .metric-value.py {{ color: var(--indigo); }}
    .metric-value.sf {{ color: var(--teal); font-weight: 700; }}
    .metric-divider {{ color: #a1aab8; }}
    .variance-dot {{ width: 10px; height: 10px; display: inline-block; border-radius: 50%; margin-right: 7px; background: var(--green); }}
    .variance-dot.noisy {{ background: var(--amber); }}
    .empty-chart {{ color: var(--muted); }}
    .meta-panel {{ margin-top: 24px; background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 18px 22px; }}
    .meta-grid {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 18px; }}
    .meta-grid div {{ display: flex; justify-content: space-between; gap: 16px; border-bottom: 1px solid var(--line); padding-bottom: 8px; }}
    .footnote {{ color: var(--muted); margin: 14px 0 0; font-size: 12px; max-width: 940px; }}
    .meta-grid span {{ color: var(--muted); }} footer {{ color: var(--muted); margin-top: 22px; font-size: 12px; }}
    @media (max-width: 920px) {{ .shell {{ padding: 20px 12px 40px; }} .hero, .visual-grid {{ grid-template-columns: 1fr; }} .hero {{ padding: 20px; }} .stats, .meta-grid {{ grid-template-columns: 1fr; }} .problem-heading {{ align-items: flex-start; flex-direction: column; }} .category-bar {{ grid-template-columns: 1fr; align-items: start; }} .filter-bar {{ position: static; }} }}
  </style>
</head>
<body>
  <main class="shell">
    <section class="hero">
      <div>
        <p class="eyebrow">Sifr Benchmark Report</p>
        <h1>LeetCode runtime comparison</h1>
        <p>Hyperfine results for Python references and generated Sifr runners. Categories come first, then each problem shows runtime and memory against input size with explicit axes, followed by a table where Python and Sifr expose the same metrics side by side.</p>
        <div class="legend">
          <span><b class="py"></b>Python</span>
          <span><b class="sf"></b>Sifr</span>
          <span><span class="variance-dot stable"></span>stable</span>
          <span><span class="variance-dot noisy"></span>noisy</span>
        </div>
      </div>
      <div class="stats">
        <div class="stat"><span>Problems</span><strong>{stats["problems"]}</strong></div>
        <div class="stat"><span>Categories</span><strong>{stats["categories"]}</strong></div>
        <div class="stat"><span>Avg Speedup</span><strong>{f"{stats['average_speedup']:.2f}x" if stats["average_speedup"] else "n/a"}</strong></div>
        <div class="stat"><span>Reliable Comparisons</span><strong>{stats["stable_pairs"]}/{stats["comparisons"]}</strong></div>
      </div>
    </section>
    <section class="filter-bar" aria-label="Report filters">
      <input id="problem-search" type="search" placeholder="Filter problems by id">
      <div class="filters">
        <label><input type="checkbox" data-tier-filter="regress" checked> regress</label>
        <label><input type="checkbox" data-tier-filter="watch" checked> watch</label>
        <label><input type="checkbox" data-tier-filter="good" checked> good</label>
        <label><input type="checkbox" data-tier-filter="strong" checked> strong</label>
        <label><input id="stable-only" type="checkbox"> stable only</label>
      </div>
    </section>
    {''.join(sections)}
    <section class="meta-panel">
      <p class="eyebrow">Run Environment</p>
      <div class="meta-grid">{env_rows}</div>
      <p class="footnote">Speedup is computed only when Python and Sifr operation counts match. Throughput is problem-specific because each problem has its own operation shape. Runtime values come from hyperfine; memory values come from separate /usr/bin/time RSS samples and should be treated as process-level memory, not language heap allocation.</p>
    </section>
    <footer>Generated {escape(generated_at)} from benchmark JSON exports in <code>benchmarks/results/.raw</code>.</footer>
  </main>
  <script type="application/json" id="benchmark-data">{escape(payload)}</script>
  <script>
    const search = document.getElementById('problem-search');
    const stableOnly = document.getElementById('stable-only');
    const tierFilters = Array.from(document.querySelectorAll('[data-tier-filter]'));
    const cards = Array.from(document.querySelectorAll('.problem-card'));

    function applyFilters() {{
      const query = search.value.trim().toLowerCase();
      const tiers = new Set(tierFilters.filter((input) => input.checked).map((input) => input.dataset.tierFilter));
      const onlyStable = stableOnly.checked;
      for (const card of cards) {{
        const matchesSearch = card.dataset.problem.toLowerCase().includes(query);
        const matchesTier = tiers.has(card.dataset.tier);
        const matchesStability = !onlyStable || card.dataset.verdict === 'stable';
        card.hidden = !(matchesSearch && matchesTier && matchesStability);
      }}
      for (const section of document.querySelectorAll('.category-section')) {{
        const visible = section.querySelectorAll('.problem-card:not([hidden])').length;
        section.hidden = visible === 0;
      }}
    }}

    search.addEventListener('input', applyFilters);
    stableOnly.addEventListener('change', applyFilters);
    for (const input of tierFilters) {{
      input.addEventListener('change', applyFilters);
    }}
  </script>
</body>
</html>
"""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html, encoding="utf-8")
    print(f"wrote {output_path}")
