# Water Distribution System 🌊

A web-based interactive tool for simulating and optimizing water distribution networks. This project leverages **React-Vite**, **Vis.js**, and advanced algorithms to provide functionalities like graphical representation, leakage detection, and optimization of water flow.

## 🚀 Live Demo
[Water Distribution System](https://bharat346.github.io/Water-Distribution-System/)

---

## 📌 Features

### 1. **Graphical Representation**
- Visualizes the water distribution network as a graph.
- **Nodes** represent junctions, sources, or endpoints with attributes like:
  - `label`: Name or identifier of the node.
  - `node_type`: Type of node (e.g., source, normal).
  - Source nodes include known values for pressure and velocity.
- **Edges** represent pipes with attributes like:
  - `label`: Pipe name or identifier.
  - `distance`: Distance/length of the pipe.
  - `flow rate`: Rate of water flow through the pipe.

### 2. **Leakage Detection**
- Detects leaks in the network by analyzing flow rate mismatches or pressure anomalies using **Bernoulli's theorem**.

### 3. **New Optimal MST Without Leakage**
- Uses **Minimum Spanning Tree (MST)** algorithms to calculate an optimal network excluding problematic pipes.

### 4. **Pipe Optimization and Radius Calculation**
- Optimizes pipe dimensions based on flow rate and pressure difference.
- Calculates radius and flow capacity using **Bernoulli’s theorem** for efficient water distribution.

---

## 🛠️ Tech Stack
- **Frontend**: React with Vite
- **Visualization**: Vis.js
- **Algorithms**: MST, Greedy techniques
- **Physics**: Bernoulli’s theorem for fluid dynamics

---

## 📋 Input Format

### Nodes:
```json
{
  "label": "NodeName",
  "node_type": "source/normal",
  "pressure": 10,    // For source nodes
  "velocity": 5      // For source nodes
}

### Edges:
```json
{
  "label": "PipeName",
  "distance": 100,      // Length of the pipe
  "flow_rate": 20       // Flow rate through the pipe
}

