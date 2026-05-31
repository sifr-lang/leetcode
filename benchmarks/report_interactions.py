from __future__ import annotations


def report_script() -> str:
    return r"""
    const IMPL_LABELS = {python: 'Python', sifr: 'Sifr', nodejs: 'Node.js', node: 'Node.js', bun: 'Bun', rust: 'Rust'};
    const IMPL_SHORT_LABELS = {python: 'Py', sifr: 'Sf', nodejs: 'No', node: 'No', bun: 'Bu', rust: 'Rs'};
    const IMPL_COLORS = {python: '#4f46e5', sifr: '#0f766e', nodejs: '#15803d', node: '#15803d', bun: '#b45309', rust: '#b91c1c'};
    const IMPL_ORDER = {python: 0, sifr: 1, rust: 2, nodejs: 3, node: 3, bun: 4};
    const benchmarkData = JSON.parse(document.getElementById('benchmark-data').textContent);
    const rows = benchmarkData.rows || [];
    const search = document.getElementById('problem-search');
    const stableOnly = document.getElementById('stable-only');
    const expandAll = document.getElementById('expand-all');
    const collapseAll = document.getElementById('collapse-all');
    const candidateSelect = document.getElementById('compare-candidate');
    const baselineSelect = document.getElementById('compare-baseline');
    const tierFilters = Array.from(document.querySelectorAll('[data-tier-filter]'));
    const cards = Array.from(document.querySelectorAll('.problem-card'));

    function implLabel(impl) {
      return IMPL_LABELS[impl] || impl.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    }

    function sortedImpls(impls) {
      return Array.from(impls).sort((left, right) => (IMPL_ORDER[left] ?? 99) - (IMPL_ORDER[right] ?? 99) || left.localeCompare(right));
    }

    function htmlEscape(value) {
      return String(value).replace(/[&<>"']/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[char]));
    }

    const allImpls = sortedImpls(new Set(rows.map((row) => row.impl)));
    const categories = new Map();
    const problemIndex = new Map();
    const categoryByLower = new Map();

    for (const row of rows) {
      if (!categories.has(row.category)) categories.set(row.category, new Map());
      const problems = categories.get(row.category);
      if (!problems.has(row.problem)) problems.set(row.problem, new Map());
      const sizes = problems.get(row.problem);
      if (!sizes.has(String(row.size))) sizes.set(String(row.size), {});
      sizes.get(String(row.size))[row.impl] = row;
      problemIndex.set(row.problem, {category: row.category, sizes});
      categoryByLower.set(row.category.toLowerCase(), row.category);
    }

    function populateSelect(select, preferred) {
      select.innerHTML = allImpls.map((impl) => `<option value="${htmlEscape(impl)}">${htmlEscape(implLabel(impl))}</option>`).join('');
      select.value = allImpls.includes(preferred) ? preferred : (allImpls[0] || '');
    }

    populateSelect(candidateSelect, 'sifr');
    populateSelect(baselineSelect, 'python');

    function normalizeSelection(changedSelect) {
      if (candidateSelect.value !== baselineSelect.value || allImpls.length < 2) return;
      const other = allImpls.find((impl) => impl !== changedSelect.value);
      if (!other) return;
      if (changedSelect === candidateSelect) baselineSelect.value = other;
      else candidateSelect.value = other;
    }

    function selectedPair() {
      normalizeSelection(candidateSelect);
      return {candidate: candidateSelect.value, baseline: baselineSelect.value};
    }

    function median(values) {
      if (!values.length) return null;
      const sorted = [...values].sort((left, right) => left - right);
      const middle = Math.floor(sorted.length / 2);
      return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
    }

    function mean(values) {
      return values.length ? values.reduce((total, value) => total + value, 0) / values.length : null;
    }

    function formatFold(value) {
      if (value === null || !Number.isFinite(value)) return 'n/a';
      if (value >= 100) return `${Math.round(value)}x`;
      if (value >= 10) return `${value.toFixed(1).replace(/\.0$/, '')}x`;
      return `${value.toFixed(2).replace(/0$/, '').replace(/\.0$/, '')}x`;
    }

    function formatMs(value) {
      if (value === null || value === undefined) return 'n/a';
      return value >= 1000 ? `${(value / 1000).toFixed(2)}s` : `${value.toFixed(1)}ms`;
    }

    function formatAxisMs(value) {
      if (value >= 1000) return `${(value / 1000).toPrecision(2)}s`;
      if (value >= 100) return `${value.toFixed(0)}ms`;
      return `${value.toFixed(1)}ms`;
    }

    function formatAxisMemory(value) {
      if (value >= 1000) return `${(value / 1024).toPrecision(2)} GB`;
      if (value >= 100) return `${value.toFixed(0)} MB`;
      return `${value.toFixed(1)} MB`;
    }

    function speedupTier(speedup) {
      if (speedup === null || speedup === undefined) return 'neutral';
      if (speedup >= 3) return 'strong';
      if (speedup >= 2) return 'good';
      return speedup >= 1 ? 'marginal' : 'regress';
    }

    function deltaTier(delta) {
      if (delta === null || delta === undefined) return 'neutral';
      if (delta >= 0.10) return 'strong';
      if (delta >= 0.02) return 'good';
      return delta > -0.02 ? 'neutral' : 'regress';
    }

    function runtimeTitle(tier, candidate, baseline) {
      const left = implLabel(candidate);
      const right = implLabel(baseline);
      return {
        strong: `Strong: ${left} is at least 3x faster than ${right}`,
        good: `Good: ${left} is at least 2x faster than ${right}`,
        marginal: `Marginal: ${left} is faster than ${right}, but under 2x`,
        regress: `Regression: ${left} is slower than ${right}`,
        neutral: 'No runtime comparison',
      }[tier];
    }

    function memoryTitle(tier, candidate, baseline) {
      const left = implLabel(candidate);
      const right = implLabel(baseline);
      return {
        strong: `Strong: ${left} uses at least 10% less peak RSS than ${right}`,
        good: `Good: ${left} uses at least 2% less peak RSS than ${right}`,
        neutral: 'Neutral: peak RSS differs by less than 2%',
        regress: `Regression: ${left} uses more peak RSS than ${right}`,
      }[tier];
    }

    function formatRuntimeAdvantage(speedup, candidate) {
      if (speedup === null || speedup === undefined) return 'n/a';
      const direction = speedup >= 1 ? 'faster' : 'slower';
      const value = speedup >= 1 ? speedup : 1 / speedup;
      return `${implLabel(candidate)} ${formatFold(value)} ${direction}`;
    }

    function formatMemoryAdvantage(delta, candidate, includeMetric = false) {
      const prefix = includeMetric ? 'Memory: ' : '';
      if (delta === null || delta === undefined) return `${prefix}n/a`;
      if (Math.abs(delta) < 0.02) return `${prefix}about equal`;
      return `${prefix}${implLabel(candidate)} ${Math.abs(delta * 100).toFixed(0)}% ${delta > 0 ? 'less' : 'more'}`;
    }

    function runtimeComparison(impls, candidate, baseline) {
      const candidateRow = impls[candidate];
      const baselineRow = impls[baseline];
      if (!candidateRow || !baselineRow || candidateRow.mean_ms <= 0) return null;
      if (candidateRow.operations !== baselineRow.operations) return null;
      return baselineRow.mean_ms / candidateRow.mean_ms;
    }

    function memoryComparison(impls, candidate, baseline) {
      const candidateMemory = impls[candidate]?.peak_memory_mb;
      const baselineMemory = impls[baseline]?.peak_memory_mb;
      if (candidateMemory === null || candidateMemory === undefined || baselineMemory === null || baselineMemory === undefined || baselineMemory <= 0) return null;
      return (baselineMemory - candidateMemory) / baselineMemory;
    }

    function comparable(impls) {
      const row = Object.values(impls)[0];
      return row && row.benchmark_status === 'complete' && row.parity_status === 'equivalent';
    }

    function problemSummary(sizes, candidate, baseline) {
      const speedups = [];
      const memoryDeltas = [];
      let noisy = false;
      for (const impls of sizes.values()) {
        const speedup = runtimeComparison(impls, candidate, baseline);
        const delta = memoryComparison(impls, candidate, baseline);
        if (speedup !== null) speedups.push(speedup);
        if (delta !== null) memoryDeltas.push(delta);
        if (impls[candidate]?.verdict === 'noisy' || impls[baseline]?.verdict === 'noisy') noisy = true;
      }
      return {
        medianSpeedup: median(speedups),
        medianMemoryDelta: median(memoryDeltas),
        maxSpeedup: speedups.length ? Math.max(...speedups) : 1,
        noisy,
      };
    }

    function categorySummary(problems, candidate, baseline) {
      const speedups = [];
      const memoryDeltas = [];
      let noisy = false;
      for (const sizes of problems.values()) {
        if (![...sizes.values()].every(comparable)) continue;
        const summary = problemSummary(sizes, candidate, baseline);
        if (summary.medianSpeedup !== null) speedups.push(summary.medianSpeedup);
        if (summary.medianMemoryDelta !== null) memoryDeltas.push(summary.medianMemoryDelta);
        if (summary.noisy) noisy = true;
      }
      return {medianSpeedup: median(speedups), medianMemoryDelta: median(memoryDeltas), noisy};
    }

    function reportStats(candidate, baseline) {
      const speedups = [];
      const memoryDeltas = [];
      const problems = new Set();
      const categoriesSeen = new Set();
      let stable = 0;
      let total = 0;
      for (const [category, problemMap] of categories.entries()) {
        for (const [problem, sizes] of problemMap.entries()) {
          for (const impls of sizes.values()) {
            if (!comparable(impls)) continue;
            const speedup = runtimeComparison(impls, candidate, baseline);
            if (speedup === null) continue;
            speedups.push(speedup);
            problems.add(problem);
            categoriesSeen.add(category);
            const delta = memoryComparison(impls, candidate, baseline);
            if (delta !== null) memoryDeltas.push(delta);
            total += 1;
            if (impls[candidate]?.verdict === 'stable' && impls[baseline]?.verdict === 'stable') stable += 1;
          }
        }
      }
      return {
        problems: problems.size,
        categories: categoriesSeen.size,
        medianSpeedup: median(speedups),
        averageSpeedup: mean(speedups),
        medianMemoryDelta: median(memoryDeltas),
        stable,
        total,
      };
    }

    function setTier(element, tier, tiers = ['strong', 'good', 'marginal', 'neutral', 'regress']) {
      element.classList.remove(...tiers);
      element.classList.add(tier);
    }

    function runtimeBadge(speedup, candidate, baseline, maxSpeedup) {
      const tier = speedupTier(speedup);
      if (speedup === null) return '<span class="empty-chart">n/a</span>';
      const width = Math.min(100, Math.max(4, (speedup / Math.max(maxSpeedup, 1)) * 100));
      return `<div class="leader-cell"><strong class="${tier}" title="${htmlEscape(runtimeTitle(tier, candidate, baseline))}">${htmlEscape(formatRuntimeAdvantage(speedup, candidate))}</strong><span class="bar"><span class="${tier}" style="width: ${width.toFixed(1)}%"></span></span></div>`;
    }

    function memoryBadge(delta, candidate, baseline) {
      const tier = deltaTier(delta);
      return `<span class="delta-badge memory-comparison ${tier}" title="${htmlEscape(memoryTitle(tier, candidate, baseline))}">${htmlEscape(formatMemoryAdvantage(delta, candidate, true))}</span>`;
    }

    function updateRuntimeElement(element, speedup, candidate, baseline) {
      const tier = speedupTier(speedup);
      setTier(element, tier);
      element.title = runtimeTitle(tier, candidate, baseline);
      element.textContent = formatRuntimeAdvantage(speedup, candidate);
    }

    function updateMemoryElement(element, delta, candidate, baseline) {
      const tier = deltaTier(delta);
      setTier(element, tier, ['strong', 'good', 'neutral', 'regress']);
      element.title = memoryTitle(tier, candidate, baseline);
      element.textContent = formatMemoryAdvantage(delta, candidate, true);
    }

    function formatRange(sizes, key, formatter) {
      const values = [];
      for (const impls of sizes.values()) {
        for (const row of Object.values(impls)) {
          const value = row[key];
          if (value !== null && value !== undefined && value > 0) values.push(value);
        }
      }
      if (!values.length) return 'n/a';
      return `${formatter(Math.min(...values))}-${formatter(Math.max(...values))}`;
    }

    function logXPositions(sizes, left, width) {
      if (sizes.length === 1) return new Map([[sizes[0], left + width / 2]]);
      const logs = sizes.map((size) => Math.log10(size));
      const minimum = Math.min(...logs);
      const span = Math.max(...logs) - minimum || 1;
      return new Map(sizes.map((size) => [size, left + ((Math.log10(size) - minimum) / span) * width]));
    }

    function yScale(values, logScale) {
      if (logScale) {
        const logs = values.map((value) => Math.log10(value));
        let minLog = Math.min(...logs);
        let maxLog = Math.max(...logs);
        if (Math.abs(maxLog - minLog) < 1e-9) {
          minLog -= 0.5;
          maxLog += 0.5;
        } else {
          const padding = (maxLog - minLog) * 0.08;
          minLog -= padding;
          maxLog += padding;
        }
        const span = maxLog - minLog;
        return {
          ticks: Array.from({length: 5}, (_, index) => 10 ** (minLog + (span * index / 4))),
          normalize: (value) => (Math.log10(value) - minLog) / span,
        };
      }
      let minimum = Math.min(...values);
      let maximum = Math.max(...values);
      if (Math.abs(maximum - minimum) < 1e-9) {
        minimum = Math.max(0, minimum * 0.8);
        maximum *= 1.2;
      } else {
        const padding = (maximum - minimum) * 0.10;
        minimum = Math.max(0, minimum - padding);
        maximum += padding;
      }
      const span = maximum - minimum || 1;
      return {
        ticks: Array.from({length: 5}, (_, index) => minimum + (span * index / 4)),
        normalize: (value) => (value - minimum) / span,
      };
    }

    function renderChart(sizes, key, candidate, baseline) {
      const impls = [baseline, candidate];
      const points = new Map(impls.map((impl) => [impl, []]));
      for (const [sizeText, sizeImpls] of [...sizes.entries()].sort((left, right) => Number(left[0]) - Number(right[0]))) {
        for (const impl of impls) {
          const value = sizeImpls[impl]?.[key];
          if (value !== null && value !== undefined && value > 0) points.get(impl).push([Number(sizeText), Number(value)]);
        }
      }
      const allPoints = impls.flatMap((impl) => points.get(impl));
      if (!allPoints.length) return '<span class="empty-chart">n/a</span>';
      const width = 720;
      const height = 330;
      const left = 104;
      const right = 28;
      const top = 24;
      const bottom = 62;
      const plotWidth = width - left - right;
      const plotHeight = height - top - bottom;
      const sizeValues = [...new Set(allPoints.map(([size]) => size))].sort((a, b) => a - b);
      const xPositions = logXPositions(sizeValues, left, plotWidth);
      const values = allPoints.map(([, value]) => value);
      const logScale = key === 'mean_ms';
      const formatter = key === 'mean_ms' ? formatAxisMs : formatAxisMemory;
      const scale = yScale(values, logScale);
      const yPos = (value) => top + plotHeight - (scale.normalize(value) * plotHeight);
      const grid = scale.ticks.map((tick) => {
        const y = yPos(tick);
        return `<line x1="${left}" y1="${y.toFixed(1)}" x2="${width - right}" y2="${y.toFixed(1)}"></line><text class="axis-label" x="${left - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end">${htmlEscape(formatter(tick))}</text>`;
      }).join('');
      const xGrid = sizeValues.map((size) => `<line x1="${xPositions.get(size).toFixed(1)}" y1="${top}" x2="${xPositions.get(size).toFixed(1)}" y2="${height - bottom}"></line>`).join('');
      const xTicks = sizeValues.map((size) => `<text class="axis-label" x="${xPositions.get(size).toFixed(1)}" y="${height - 34}" text-anchor="middle">${size >= 1000000 ? `${size / 1000000}M` : size >= 1000 ? `${size / 1000}K` : size}</text>`).join('');
      const series = (impl, index) => {
        const coordinates = points.get(impl).map(([size, value]) => [xPositions.get(size), yPos(value) + (index === 0 ? -3 : 3)]);
        const pointText = coordinates.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
        const circles = points.get(impl).map(([size, value], pointIndex) => {
          const [x, y] = coordinates[pointIndex];
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"><title>${htmlEscape(implLabel(impl))}: ${htmlEscape(formatter(value))}</title></circle>`;
        }).join('');
        const color = IMPL_COLORS[impl] || '#475467';
        return `<polyline class="line" style="stroke: ${color}" points="${pointText}"></polyline><g class="series" style="--impl-color: ${color}">${circles}</g>`;
      };
      const baselineColor = IMPL_COLORS[baseline] || '#475467';
      const candidateColor = IMPL_COLORS[candidate] || '#475467';
      const yTitle = key === 'mean_ms' ? 'Mean runtime (log scale)' : 'Peak RSS (MB, linear scale)';
      return `<svg class="axis-chart ${key === 'mean_ms' ? 'runtime-chart' : 'memory-chart'}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${key === 'mean_ms' ? 'Mean runtime versus input size' : 'Peak RSS versus input size'}"><g class="grid">${grid}${xGrid}</g><line class="axis" x1="${left}" y1="${top}" x2="${left}" y2="${height - bottom}"></line><line class="axis" x1="${left}" y1="${height - bottom}" x2="${width - right}" y2="${height - bottom}"></line>${series(baseline, 0)}${series(candidate, 1)}${xTicks}<g class="chart-legend" transform="translate(${width - 178} 24)"><circle class="legend-dot" style="--impl-color: ${baselineColor}" cx="0" cy="0" r="4"></circle><text x="10" y="4">${htmlEscape(implLabel(baseline))}</text><circle class="legend-dot" style="--impl-color: ${candidateColor}" cx="82" cy="0" r="4"></circle><text x="92" y="4">${htmlEscape(implLabel(candidate))}</text></g><text class="axis-title" x="${(left + plotWidth / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle">Input size (log scale)</text><text class="axis-title" transform="rotate(-90 20 ${(top + plotHeight / 2).toFixed(1)})" x="20" y="${(top + plotHeight / 2).toFixed(1)}" text-anchor="middle">${htmlEscape(yTitle)}</text></svg>`;
    }

    function updateReport() {
      const {candidate, baseline} = selectedPair();
      const stats = reportStats(candidate, baseline);
      document.getElementById('hero-title').textContent = `Runtime: ${formatRuntimeAdvantage(stats.medianSpeedup, candidate)} · Memory: ${formatMemoryAdvantage(stats.medianMemoryDelta, candidate)}`;
      document.getElementById('hero-copy').textContent = `Hyperfine results for selected implementations. The active comparison is ${implLabel(candidate)} versus ${implLabel(baseline)}; per-problem bars, per-size tables, and diagnostics still show every measured implementation.`;
      document.querySelector('.stats .stat:first-child strong').textContent = stats.problems;
      document.querySelector('.stats .stat:nth-child(2) strong').textContent = stats.categories;
      updateRuntimeElement(document.getElementById('stat-median-runtime'), stats.medianSpeedup, candidate, baseline);
      updateMemoryElement(document.getElementById('stat-median-memory'), stats.medianMemoryDelta, candidate, baseline);
      updateRuntimeElement(document.getElementById('stat-mean-runtime'), stats.averageSpeedup, candidate, baseline);
      document.getElementById('stat-reliable').textContent = `${stats.stable}/${stats.total}`;

      for (const card of cards) {
        const problem = problemIndex.get(card.dataset.problem);
        if (!problem) continue;
        const summary = problemSummary(problem.sizes, candidate, baseline);
        const runtime = card.querySelector(':scope > summary .runtime-comparison');
        const memory = card.querySelector(':scope > summary .memory-comparison');
        updateRuntimeElement(runtime, summary.medianSpeedup, candidate, baseline);
        updateMemoryElement(memory, summary.medianMemoryDelta, candidate, baseline);
        card.dataset.tier = speedupTier(summary.medianSpeedup);
        card.dataset.verdict = summary.noisy ? 'noisy' : 'stable';
        for (const tableRow of card.querySelectorAll('tbody tr[data-size]')) {
          const impls = problem.sizes.get(String(tableRow.dataset.size)) || {};
          const speedup = runtimeComparison(impls, candidate, baseline);
          const tier = speedupTier(speedup);
          tableRow.dataset.tier = tier;
          tableRow.dataset.valid = speedup === null ? 'no' : 'yes';
          tableRow.dataset.verdict = impls[candidate]?.verdict === 'noisy' || impls[baseline]?.verdict === 'noisy' ? 'noisy' : 'stable';
          tableRow.querySelector('.runtime-lead-cell').innerHTML = runtimeBadge(speedup, candidate, baseline, summary.maxSpeedup);
          tableRow.querySelector('.memory-lead-cell').innerHTML = memoryBadge(memoryComparison(impls, candidate, baseline), candidate, baseline);
        }
        for (const plot of card.querySelectorAll('.chart-plot')) {
          const key = plot.dataset.chartKey;
          plot.innerHTML = renderChart(problem.sizes, key, candidate, baseline);
          const formatter = key === 'mean_ms' ? formatAxisMs : formatAxisMemory;
          plot.parentElement.querySelector('strong').textContent = formatRange(problem.sizes, key, formatter);
        }
      }

      for (const section of document.querySelectorAll('.category-section')) {
        const categoryName = categoryByLower.get(section.dataset.category);
        const problems = categories.get(categoryName);
        if (!problems) continue;
        const summary = categorySummary(problems, candidate, baseline);
        updateRuntimeElement(section.querySelector(':scope > summary .runtime-comparison'), summary.medianSpeedup, candidate, baseline);
        updateMemoryElement(section.querySelector(':scope > summary .memory-comparison'), summary.medianMemoryDelta, candidate, baseline);
        for (const bar of section.querySelectorAll('.category-bar')) {
          const problem = problemIndex.get(bar.dataset.problem);
          if (!problem) continue;
          const problemStats = problemSummary(problem.sizes, candidate, baseline);
          bar.dataset.tier = speedupTier(problemStats.medianSpeedup);
          const runtime = bar.querySelector('.runtime-comparison');
          const memory = bar.querySelector('.memory-comparison');
          updateRuntimeElement(runtime, problemStats.medianSpeedup, candidate, baseline);
          updateMemoryElement(memory, problemStats.medianMemoryDelta, candidate, baseline);
        }
      }
      applyFilters();
    }

    function applyFilters() {
      const query = search.value.trim().toLowerCase();
      const tiers = new Set(tierFilters.filter((input) => input.checked).map((input) => input.dataset.tierFilter));
      const onlyStable = stableOnly.checked;
      for (const card of cards) {
        const category = card.closest('.category-section').dataset.category;
        const matchesSearch = card.dataset.problem.toLowerCase().includes(query) || category.includes(query);
        const matchesTier = tiers.has(card.dataset.tier);
        const matchesStability = !onlyStable || card.dataset.verdict === 'stable';
        card.hidden = !(matchesSearch && matchesTier && matchesStability);
      }
      for (const section of document.querySelectorAll('.category-section')) {
        const visible = section.querySelectorAll('.problem-card:not([hidden])').length;
        section.hidden = visible === 0;
        if (query && visible > 0) section.open = true;
        if (!query) section.open = false;
      }
    }

    search.addEventListener('input', applyFilters);
    stableOnly.addEventListener('change', applyFilters);
    candidateSelect.addEventListener('change', () => { normalizeSelection(candidateSelect); updateReport(); });
    baselineSelect.addEventListener('change', () => { normalizeSelection(baselineSelect); updateReport(); });
    expandAll.addEventListener('click', () => document.querySelectorAll('.category-section:not([hidden]), .problem-card:not([hidden])').forEach((item) => item.open = true));
    collapseAll.addEventListener('click', () => document.querySelectorAll('.category-section, .problem-card').forEach((item) => item.open = false));
    for (const input of tierFilters) input.addEventListener('change', applyFilters);
    updateReport();
    """
