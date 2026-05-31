class UnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = Array(n).fill(0);
    }
    find(x) {
        while (this.parent[x] !== x) {
            this.parent[x] = this.parent[this.parent[x]];
            x = this.parent[x];
        }
        return x;
    }
    union(a, b) {
        const pa = this.find(a);
        const pb = this.find(b);
        if (pa === pb) return;
        if (this.rank[pa] < this.rank[pb]) this.parent[pa] = pb;
        else if (this.rank[pa] > this.rank[pb]) this.parent[pb] = pa;
        else {
            this.parent[pb] = pa;
            this.rank[pa]++;
        }
    }
}

function accountsMerge(accounts) {
    const uf = new UnionFind(accounts.length);
    const emailToAcc = new Map();
    for (let i = 0; i < accounts.length; i++) {
        for (let j = 1; j < accounts[i].length; j++) {
            const email = accounts[i][j];
            if (emailToAcc.has(email)) uf.union(i, emailToAcc.get(email));
            else emailToAcc.set(email, i);
        }
    }
    const emailGroup = new Map();
    for (const [email, i] of emailToAcc.entries()) {
        const leader = uf.find(i);
        if (!emailGroup.has(leader)) emailGroup.set(leader, []);
        emailGroup.get(leader).push(email);
    }
    const res = [];
    for (const [i, emails] of emailGroup.entries()) {
        res.push([accounts[i][0], ...emails.sort()]);
    }
    return res;
}

module.exports = { accountsMerge };

if (require.main === module) {
    const assert = require('assert');
    function ListNode(val = 0, next = null) { this.val = val; this.next = next; }
    function TreeNode(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
    function Node(val = 0, neighbors = []) { this.val = val; this.neighbors = neighbors; }
    function listNodeToString(node) {
        const values = [];
        let current = node;
        while (current !== null) {
            values.push(String(current.val));
            current = current.next;
        }
        return values.join('->');
    }
    function treeToString(node) {
        if (node === null) return 'None';
        return `${node.val}(${treeToString(node.left)},${treeToString(node.right)})`;
    }
    function sorted(value) { return value.slice().sort(); }
    assert.deepStrictEqual(accountsMerge([["John", "johnsmith@mail.com", "john_newyork@mail.com"], ["John", "johnsmith@mail.com", "john00@mail.com"], ["Mary", "mary@mail.com"], ["John", "johnnybravo@mail.com"]]), [["John", "john00@mail.com", "john_newyork@mail.com", "johnsmith@mail.com"], ["Mary", "mary@mail.com"], ["John", "johnnybravo@mail.com"]]);
    assert.deepStrictEqual(accountsMerge([["Gabe", "Gabe0@m.co", "Gabe3@m.co", "Gabe1@m.co"], ["Kevin", "Kevin3@m.co", "Kevin5@m.co", "Kevin0@m.co"], ["Ethan", "Ethan5@m.co", "Ethan4@m.co", "Ethan0@m.co"], ["Hanzo", "Hanzo3@m.co", "Hanzo1@m.co", "Hanzo0@m.co"], ["Fern", "Fern5@m.co", "Fern1@m.co", "Fern0@m.co"]]), [["Gabe", "Gabe0@m.co", "Gabe1@m.co", "Gabe3@m.co"], ["Kevin", "Kevin0@m.co", "Kevin3@m.co", "Kevin5@m.co"], ["Ethan", "Ethan0@m.co", "Ethan4@m.co", "Ethan5@m.co"], ["Hanzo", "Hanzo0@m.co", "Hanzo1@m.co", "Hanzo3@m.co"], ["Fern", "Fern0@m.co", "Fern1@m.co", "Fern5@m.co"]]);
}
