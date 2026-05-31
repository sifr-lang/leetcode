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

function findRedundantConnection(edges) {
  const par = Array.from({ length: edges.length + 1 }, (_, i) => i);
  const rank = Array(edges.length + 1).fill(1);
  function find(n) { let p = par[n]; while (p !== par[p]) { par[p] = par[par[p]]; p = par[p]; } return p; }
  function union(n1, n2) {
    const p1 = find(n1), p2 = find(n2);
    if (p1 === p2) return false;
    if (rank[p1] > rank[p2]) { par[p2] = p1; rank[p1] += rank[p2]; }
    else { par[p1] = p2; rank[p2] += rank[p1]; }
    return true;
  }
  for (const [n1, n2] of edges) if (!union(n1, n2)) return [n1, n2];
  return undefined;
}

module.exports = { findRedundantConnection };

if (require.main === module) {
  const assert = require('assert');
  assert.deepStrictEqual(findRedundantConnection([[1, 2], [1, 3], [2, 3]]), [2, 3]);
  assert.deepStrictEqual(findRedundantConnection([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]), [1, 4]);
}
