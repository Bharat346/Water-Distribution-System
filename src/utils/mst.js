import MinPriorityQueue from "./priorityQ.js";

class UnionFind {
  constructor(size) {
    this.parent = Array.from({ length: size }, (_, i) => i);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX !== rootY) {
      this.parent[rootX] = rootY; // Union by root
    }
  }

  connected(x, y) {
    return this.find(x) === this.find(y);
  }
}

export function calculateMST(nodes, edges) {
  const mst = [];
  const minHeap = new MinPriorityQueue();
  const uf = new UnionFind(nodes.length);

  // Enqueue all edges into the MinPriorityQueue
  for (const edge of edges) {
    minHeap.enqueue(edge, edge.distance);
  }

  // Keep extracting the minimum edge until we form an MST
  while (!minHeap.isEmpty() && mst.length < nodes.length - 1) {
    const { element: edge } = minHeap.dequeue();
    const { source, target, distance } = edge;

    // Use Union-Find to check if adding this edge will form a cycle
    if (!uf.connected(source, target)) {
      uf.union(source, target);
      mst.push(edge);
    }
  }

  return mst;
}
