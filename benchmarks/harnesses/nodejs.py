from __future__ import annotations

import json
from pathlib import Path
from typing import Any

def render_nodejs_runner(source_js: Path, function: str, runner: dict[str, Any]) -> str:
    return NODEJS_RUNNER_TEMPLATE.replace("__SOURCE_JS__", json.dumps(str(source_js))).replace(
        "__FUNCTION__", json.dumps(function)
    ).replace("__RUNNER__", json.dumps(runner, separators=(",", ":")))

NODEJS_RUNNER_TEMPLATE = r"""
const fs = require('fs');

const source = require(__SOURCE_JS__);
const target = source[__FUNCTION__];
const runner = __RUNNER__;

function parseInput(inputText) {
  const tokens = inputText.split(/\s+/).filter((token) => token.length > 0);
  const values = {};
  for (const binding of runner.input.bindings) values[binding.name] = parseBinding(tokens, binding);
  return values;
}

function parseBinding(tokens, binding) {
  if (binding.type === 'int' && binding.source === 'token') return Number(tokens[Number(binding.index)]);
  if (binding.type === 'float' && binding.source === 'token') return Number(tokens[Number(binding.index)]);
  if (binding.type === 'str' && binding.source === 'token') return tokens[Number(binding.index)];
  if (['list[int]', 'list[str]', 'list[float]'].includes(binding.type) && binding.source === 'tokens') {
    let start = Number(binding.start || 0);
    for (const index of binding.start_after_count_indices || []) start += Number(tokens[Number(index)]);
    let end = binding.end === undefined ? undefined : Number(binding.end);
    if (binding.count_index !== undefined) end = start + Number(tokens[Number(binding.count_index)]);
    const selected = tokens.slice(start, end);
    if (binding.type === 'list[int]') return selected.map(Number);
    if (binding.type === 'list[float]') return selected.map(Number);
    return selected;
  }
  if (['matrix[int]', 'matrix[str]'].includes(binding.type) && binding.source === 'matrix_tokens') {
    const rows = Number(tokens[Number(binding.rows_index)]);
    const cols = Number(tokens[Number(binding.cols_index)]);
    let index = Number(binding.start);
    for (const countIndex of binding.start_after_count_indices || []) index += Number(tokens[Number(countIndex)]);
    const matrix = [];
    for (let row = 0; row < rows; row++) {
      const values = tokens.slice(index, index + cols);
      matrix.push(binding.type === 'matrix[int]' ? values.map(Number) : values);
      index += cols;
    }
    return matrix;
  }
  if (binding.type === 'ragged[int]' && binding.source === 'segmented_tokens') {
    const rows = Number(tokens[Number(binding.count_index)]);
    let index = Number(binding.start || 0);
    const result = [];
    for (let row = 0; row < rows; row++) {
      const valueCount = Number(tokens[index]);
      index++;
      result.push(tokens.slice(index, index + valueCount).map(Number));
      index += valueCount;
    }
    return result;
  }
  if (binding.type === 'list_node[int]' && binding.source === 'tokens') {
    const values = parseBinding(tokens, { ...binding, type: 'list[int]' });
    let head = null;
    for (let index = values.length - 1; index >= 0; index--) head = new ListNode(values[index], head);
    return head;
  }
  if (binding.type === 'list[list_node[int]]' && binding.source === 'segmented_tokens') {
    const listCount = Number(tokens[Number(binding.count_index)]);
    let index = Number(binding.start || 0);
    const lists = [];
    for (let listIndex = 0; listIndex < listCount; listIndex++) {
      const valueCount = Number(tokens[index]);
      index++;
      let head = null;
      for (let valueIndex = index + valueCount - 1; valueIndex >= index; valueIndex--) head = new ListNode(Number(tokens[valueIndex]), head);
      index += valueCount;
      lists.push(head);
    }
    return lists;
  }
  if (binding.type === 'balanced_tree[int]' && binding.source === 'tokens') {
    const values = parseBinding(tokens, { ...binding, type: 'list[int]' });
    const build = (left, right) => {
      if (left > right) return null;
      const mid = Math.floor((left + right) / 2);
      return new TreeNode(values[mid], build(left, mid - 1), build(mid + 1, right));
    };
    return build(0, values.length - 1);
  }
  throw new Error(`unsupported input binding: ${JSON.stringify(binding)}`);
}

class ListNode {
  constructor(val = 0, next = null) { this.val = val; this.next = next; }
}

class TreeNode {
  constructor(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

function callSingle(values, call) {
  if (call.python_adapter === 'graph_adjacency') {
    return graphToAdjacency(target(buildGraphFromAdjacency(values[call.args[0]])));
  }
  const args = call.args.map((name) => call.copy_args?.includes(name) ? copyArg(values[name]) : values[name]);
  if (call.python_self) args.unshift(null);
  return target(...args);
}

function copyArg(value) {
  if (Array.isArray(value)) return value.map((item) => Array.isArray(item) ? item.slice() : item);
  return value;
}

function freshInputEachCall() {
  return runner.input.bindings.some((binding) => ['list_node[int]', 'list[list_node[int]]', 'balanced_tree[int]'].includes(binding.type));
}

function buildGraphFromAdjacency(adjacency) {
  if (adjacency.length === 0) return null;
  const nodes = adjacency.map((_, index) => ({ val: index + 1, neighbors: [] }));
  for (let index = 0; index < adjacency.length; index++) {
    nodes[index].neighbors = adjacency[index]
      .filter((value) => value >= 1 && value <= nodes.length)
      .map((value) => nodes[value - 1]);
  }
  return nodes[0];
}

function graphToAdjacency(node) {
  if (node === null || node === undefined) return [];
  const seen = new Map();
  const stack = [node];
  while (stack.length > 0) {
    const current = stack.pop();
    if (seen.has(current.val)) continue;
    seen.set(current.val, current);
    for (const neighbor of current.neighbors || []) {
      if (!seen.has(neighbor.val)) stack.push(neighbor);
    }
  }
  return [...seen.keys()]
    .sort((left, right) => left - right)
    .map((value) => (seen.get(value).neighbors || []).map((neighbor) => neighbor.val).sort((left, right) => left - right));
}

function assertExpected(actual, expectedText, expected) {
  const actualText = formatExpected(actual, expected).trim();
  const expectedValue = expectedText.trim();
  if (actualText !== expectedValue) throw new Error(`wrong result: ${actualText}, expected ${expectedValue}`);
}

function formatExpected(result, expected) {
  if (expected.type === 'int') return `${Number(result)}\n`;
  if (expected.type === 'float') {
    const value = Number(result);
    return `${Number.isInteger(value) ? value.toFixed(1) : String(value)}\n`;
  }
  if (expected.type === 'bool') return `${result ? 1 : 0}\n`;
  if (expected.type === 'list_int') return `${pyList(normalizeSequenceResult(result, expected))}\n`;
  if (expected.type === 'list_node_int') return `${listNodeToText(result)}\n`;
  if (expected.type === 'tree_node_int') return `${treeNodeToText(result)}\n`;
  if (expected.type === 'str') return `${String(result)}\n`;
  if (['list_str', 'list_list_str', 'list_list_int'].includes(expected.type)) return `${pyList(normalizeSequenceResult(result, expected))}\n`;
  throw new Error(`unsupported expected shape: ${expected.type}`);
}

function normalizeSequenceResult(value, expected) {
  let normalized = normalizeSequenceValue(value);
  if (expected.sort_inner_lists) {
    normalized = normalized.map((item) => Array.isArray(item) ? item.slice().sort(compareSequenceValues) : item);
  }
  if (expected.sort_result) normalized.sort(compareSequenceValues);
  return normalized;
}

function normalizeSequenceValue(value) {
  if (Array.isArray(value)) return value.map(normalizeSequenceValue);
  return value;
}

function compareSequenceValues(left, right) {
  if (Array.isArray(left) && Array.isArray(right)) {
    const limit = Math.min(left.length, right.length);
    for (let index = 0; index < limit; index++) {
      const compared = compareSequenceValues(left[index], right[index]);
      if (compared !== 0) return compared;
    }
    return left.length - right.length;
  }
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  const leftKey = pyAtom(left);
  const rightKey = pyAtom(right);
  return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
}

function pyList(value) {
  return `[${value.map((item) => Array.isArray(item) ? pyList(item) : pyAtom(item)).join(', ')}]`;
}

function pyAtom(value) {
  if (typeof value === 'string') return JSON.stringify(value);
  return String(value);
}

function resultChecksum(result, expected) {
  if (expected.type === 'int') return Number(result);
  if (expected.type === 'float') return Math.trunc(Number(result) * 1000.0);
  if (expected.type === 'bool') return result ? 1 : 0;
  if (expected.type === 'list_int') return result.length;
  if (['list_str', 'list_list_int', 'list_list_str'].includes(expected.type)) return pyList(normalizeSequenceResult(result, expected)).length;
  if (expected.type === 'list_node_int') return listNodeToText(result).length;
  if (expected.type === 'tree_node_int') return treeNodeToText(result).length;
  if (expected.type === 'str') return String(result).length;
  throw new Error(`unsupported checksum result shape: ${expected.type}`);
}

function listNodeToText(node) {
  if (node === null) return 'None';
  const values = [];
  for (let current = node; current !== null; current = current.next) values.push(String(current.val));
  return values.join('->');
}

function treeNodeToText(node) {
  if (node === null) return 'None';
  return `${node.val}(${treeNodeToText(node.left)},${treeNodeToText(node.right)})`;
}

function runBatch(values, call) {
  return values[call.items].map((value) => target(value));
}

function boolBatchChecksum(results) {
  let trueCount = 0;
  let checksum = 0;
  for (let index = 0; index < results.length; index++) {
    if (results[index]) {
      trueCount++;
      checksum += index + 1;
    }
  }
  return [trueCount, checksum];
}

function batchChecksum(values, call, loops) {
  let total = 0;
  for (let loop = 0; loop < loops; loop++) {
    for (const value of values[call.items]) if (target(value)) total++;
  }
  return total;
}

function parseObjectArgs(tokens, specs) {
  const args = [];
  let cursor = 0;
  for (const spec of specs) {
    const [value, next] = parseObjectArg(tokens, cursor, typeof spec === 'string' ? { type: spec } : spec);
    args.push(value);
    cursor = next;
  }
  return args;
}

function parseObjectArg(tokens, cursor, spec) {
  if (spec.type === 'int') return [Number(tokens[cursor]), cursor + 1];
  if (spec.type === 'point[int]') return [[Number(tokens[cursor]), Number(tokens[cursor + 1])], cursor + 2];
  if (spec.type === 'str') return [tokens[cursor], cursor + 1];
  if (spec.type === 'list[int]') {
    const count = Number(tokens[cursor]);
    return [tokens.slice(cursor + 1, cursor + 1 + count).map(Number), cursor + 1 + count];
  }
  if (spec.type === 'matrix[int]') {
    const rows = Number(tokens[cursor]);
    const cols = Number(tokens[cursor + 1]);
    let index = cursor + 2;
    const matrix = [];
    for (let row = 0; row < rows; row++) {
      matrix.push(tokens.slice(index, index + cols).map(Number));
      index += cols;
    }
    return [matrix, index];
  }
  throw new Error(`unsupported object argument type: ${spec.type}`);
}

function objectResultChecksum(result, resultType) {
  if (resultType === 'bool') return result ? 1 : 0;
  if (resultType === 'int') return Number(result);
  if (resultType === 'float') return Math.trunc(Number(result) * 1000.0);
  if (resultType === 'str') return String(result).length;
  if (resultType === 'list_int') return result.length;
  if (resultType === 'none') return 0;
  throw new Error(`unsupported object result type: ${resultType}`);
}

function runObjectOps(inputText, validate, expectedCount, expectedChecksum) {
  const lines = inputText.split(/\n/).filter((line) => line.trim().length > 0);
  const call = runner.call;
  let constructorArgs = [];
  let startLine = 0;
  if (lines.length && lines[0].split(/\s+/)[0] === '__init__') {
    constructorArgs = parseObjectArgs(lines[0].split(/\s+/).slice(1), call.constructor_args || []);
    startLine = 1;
  }
  const obj = new target(...constructorArgs);
  let resultCount = 0;
  let checksum = 0;
  let queryIndex = 0;
  for (const line of lines.slice(startLine)) {
    const parts = line.split(/\s+/);
    const methodSpec = call.methods?.[parts[0]];
    if (!methodSpec) continue;
    const result = obj[parts[0]](...parseObjectArgs(parts.slice(1), methodSpec.args || []));
    if (result !== undefined && result !== null) {
      queryIndex++;
      resultCount++;
      checksum += queryIndex * objectResultChecksum(result, methodSpec.result || 'int');
    }
  }
  if (validate && (resultCount !== expectedCount || checksum !== expectedChecksum)) {
    throw new Error(`wrong result: ${resultCount} ${checksum}`);
  }
  return checksum;
}

function run(fixturePath, expectedPath, loops) {
  const fixtureText = fs.readFileSync(fixturePath, 'utf8');
  const expectedText = fs.readFileSync(expectedPath, 'utf8');
  const call = runner.call;
  const expected = runner.expected;
  if (call.mode === 'object_ops') {
    const [expectedCount, expectedChecksum] = expectedText.trim().split(/\s+/).map(Number);
    runObjectOps(fixtureText, true, expectedCount, expectedChecksum);
    let aggregate = 0;
    for (let loop = 0; loop < loops; loop++) aggregate += runObjectOps(fixtureText, false, expectedCount, expectedChecksum);
    console.log(`OK ${aggregate}`);
    return;
  }
  if (call.mode === 'single') {
    const values = parseInput(fixtureText);
    assertExpected(callSingle(values, call), expectedText, expected);
    let total = 0;
    if (freshInputEachCall()) {
      for (let loop = 0; loop < loops; loop++) total += resultChecksum(callSingle(parseInput(fixtureText), call), expected);
    } else {
      for (let loop = 0; loop < loops; loop++) total += resultChecksum(callSingle(values, call), expected);
    }
    console.log(`OK ${total}`);
    return;
  }
  if (call.mode === 'mutates_single') {
    let values = parseInput(fixtureText);
    callSingle(values, call);
    assertExpected(values[call.mutated_arg], expectedText, expected);
    let total = 0;
    for (let loop = 0; loop < loops; loop++) {
      values = parseInput(fixtureText);
      callSingle(values, call);
      total += resultChecksum(values[call.mutated_arg], expected);
    }
    console.log(`OK ${total}`);
    return;
  }
  if (call.mode === 'batch') {
    const values = parseInput(fixtureText);
    const results = runBatch(values, call);
    const [count, checksum] = boolBatchChecksum(results);
    const [expectedCount, expectedChecksum] = expectedText.trim().split(/\s+/).map(Number);
    if (count !== expectedCount || checksum !== expectedChecksum) throw new Error(`wrong result: ${count} ${checksum}`);
    console.log(`OK ${batchChecksum(values, call, loops)}`);
    return;
  }
  throw new Error(`unsupported runner call mode: ${call.mode}`);
}

if (process.argv.length < 5) {
  console.error('usage: node runner.js <fixture> <expected> <loops>');
  process.exit(2);
}

run(process.argv[2], process.argv[3], Number(process.argv[4]));
""".lstrip()
