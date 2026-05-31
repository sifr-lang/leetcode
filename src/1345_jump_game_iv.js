class ListNode {
  constructor(val = 0, next = null) { this.val = val; this.next = next; }
}

class TreeNode {
  constructor(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

class Node {
  constructor(val = 0, next = null, random = null, left = null, right = null, neighbors = null, key = -1) {
    this.val = val;
    this.next = next;
    this.random = random;
    this.left = left;
    this.right = right;
    this.neighbors = neighbors === null ? [] : neighbors;
    this.key = key;
  }
}

function listNodeToString(node) {
  const parts = [];
  for (let cur = node; cur !== null; cur = cur.next) parts.push(String(cur.val));
  return parts.length ? parts.join('->') : 'None';
}

function treeToString(node) {
  if (node === null || node === undefined) return 'None';
  return `${node.val}(${treeToString(node.left)},${treeToString(node.right)})`;
}

function buildListNode(values) {
  const dummy = new ListNode();
  let tail = dummy;
  for (const value of values) {
    tail.next = new ListNode(value);
    tail = tail.next;
  }
  return dummy.next;
}

class MinHeap {
  constructor(compare = (a, b) => a < b) { this.data = []; this.compare = compare; }
  get length() { return this.data.length; }
  peek() { return this.data[0]; }
  push(value) {
    this.data.push(value);
    this._up(this.data.length - 1);
  }
  pop() {
    if (this.data.length === 0) return undefined;
    const root = this.data[0];
    const last = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = last;
      this._down(0);
    }
    return root;
  }
  _up(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (!this.compare(this.data[i], this.data[p])) break;
      [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
      i = p;
    }
  }
  _down(i) {
    while (true) {
      const l = i * 2 + 1;
      const r = l + 1;
      let best = i;
      if (l < this.data.length && this.compare(this.data[l], this.data[best])) best = l;
      if (r < this.data.length && this.compare(this.data[r], this.data[best])) best = r;
      if (best === i) break;
      [this.data[i], this.data[best]] = [this.data[best], this.data[i]];
      i = best;
    }
  }
}

class UnionFind {
  constructor(n = null) {
    this.f = new Map();
    this.par = n === null ? [] : Array.from({ length: n }, (_, i) => i);
    this.rank = n === null ? [] : Array(n).fill(1);
    this.size = n === null ? [] : Array(n).fill(1);
    this.count = n === null ? 0 : n;
  }
  findParent(x) {
    const y = this.f.has(x) ? this.f.get(x) : x;
    if (x !== y) {
      const root = this.findParent(y);
      this.f.set(x, root);
      return root;
    }
    return y;
  }
  find(x) {
    if (this.par.length === 0) return this.findParent(x);
    while (x !== this.par[x]) {
      this.par[x] = this.par[this.par[x]];
      x = this.par[x];
    }
    return x;
  }
  union(x, y) {
    if (this.par.length === 0) {
      const px = this.findParent(x), py = this.findParent(y);
      if (px === py) return false;
      this.f.set(px, py);
      return true;
    }
    const px = this.find(x), py = this.find(y);
    if (px === py) return false;
    if (this.rank[px] > this.rank[py]) {
      this.par[py] = px;
      this.rank[px] += this.rank[py];
      this.size[px] += this.size[py];
    } else {
      this.par[px] = py;
      this.rank[py] += this.rank[px];
      this.size[py] += this.size[px];
    }
    this.count -= 1;
    return true;
  }
}

function minJumps(arr) {
  const n = arr.length;
  if (n < 2) return 0;
  const d = new Map();
  for (let i = n - 1; i >= 0; i--) {
    if (!d.has(arr[i])) d.set(arr[i], []);
    d.get(arr[i]).push(i);
  }
  const seen = Array(n).fill(false);
  seen[0] = true;
  function getUnqueuedNeighbors(i) {
    const adj = [];
    if (0 < i && !seen[i - 1]) { seen[i - 1] = true; adj.push(i - 1); }
    if (i < n - 1 && !seen[i + 1]) { seen[i + 1] = true; adj.push(i + 1); }
    if (d.has(arr[i])) {
      for (const node of d.get(arr[i])) if (node !== i) { adj.push(node); seen[node] = true; }
      d.delete(arr[i]);
    }
    return adj;
  }
  let steps = 0;
  const level = [0];
  while (level.length) {
    steps += 1;
    const count = level.length;
    for (let c = 0; c < count; c++) {
      const current = level.shift();
      for (const nei of getUnqueuedNeighbors(current)) {
        if (nei === n - 1) return steps;
        level.push(nei);
      }
    }
  }
  return undefined;
}

module.exports = { minJumps };

if (require.main === module) {
  const assert = require('assert');
  assert.strictEqual(minJumps([100, -23, -23, 404, 100, 23, 23, 23, 3, 404]), 3);
  assert.strictEqual(minJumps([7]), 0);
  assert.strictEqual(minJumps([7, 6, 9, 6, 9, 6, 9, 7]), 1);
}
