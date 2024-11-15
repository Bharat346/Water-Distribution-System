// Graph.js

class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  // Add a node with additional data to the graph
  addNode(node, data = {}) {
    if (!this.adjacencyList[node]) {
      this.adjacencyList[node] = { data, edges: [] };
    }
  }

  // Add an edge with weight between nodes
  addEdge(node1, node2, weight = 1) {
    if (!this.adjacencyList[node1]) this.addNode(node1);
    if (!this.adjacencyList[node2]) this.addNode(node2);

    this.adjacencyList[node1].edges.push({ node: node2, weight });
    this.adjacencyList[node2].edges.push({ node: node1, weight });
  }

  // Get nodes and edges formatted for Vis Network
  getVisData() {
    const visNodes = Object.keys(this.adjacencyList).map((node) => ({
      id: node,
      label: this.adjacencyList[node].data.zoneType, // Ensure zoneType is used as the label
      title: `
        Zone: ${this.adjacencyList[node].data.zoneType}
        Density: ${this.adjacencyList[node].data.density}
        Water Need: ${this.adjacencyList[node].data.waterNeed}
        Pressure: ${this.adjacencyList[node].data.pressure}
      `,
      shape: "dot",
      color: {
        background: "#6baed6",
        border: "#2d89ef",
        highlight: {
          background: "#1f78b4",
          border: "#003366",
        },
      },
      font: { color: "#ffffff" },
    }));
  
    const visEdges = [];
    for (const node in this.adjacencyList) {
      for (const edge of this.adjacencyList[node].edges) {
        visEdges.push({
          from: node,
          to: edge.node,
          label: `Dist: ${edge.weight}`,
          font: { align: "top" },
          color: { color: "#cccccc" },
        });
      }
    }
  
    return { nodes: visNodes, edges: visEdges };
  }
  
}

export default Graph;
