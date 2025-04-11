// src/components/LeakGraph.jsx
import React, { useEffect, useState } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import { calc_pressure_diff } from "../utils/checkPressure.js";
import { calculateMST } from "../utils/mst.js";
import { datasets } from "../../public/data";
import { useDataset } from "../pages/dataSetContext";
import "../components/style/leak_graph.css";

function LeakGraph({ actualPressures, pressureThreshold }) {
  const { selectedDataset, setSelectedDataset } = useDataset();
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [showOptimalGraph, setShowOptimalGraph] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedDataset == null) {
      setSelectedDataset(1);
    }
  }, [selectedDataset, setSelectedDataset]);

  const handleDatasetChange = (event) => {
    setSelectedDataset(parseInt(event.target.value));
    setIsLoading(true);
  };

  useEffect(() => {
    if (!datasets[selectedDataset]) return;

    const nodes = datasets[selectedDataset].nodes;
    const edges = datasets[selectedDataset].edges;

    // Calculate leaking edges
    const pipesWithLeakage = calc_pressure_diff(nodes, edges, actualPressures);

    // Filter edges if optimal graph is selected
    let filteredEdges = edges;
    if (showOptimalGraph) {
      filteredEdges = edges.filter(
        (edge) =>
          !pipesWithLeakage.some(
            (leakageEdge) =>
              leakageEdge.source === edge.source &&
              leakageEdge.target === edge.target &&
              leakageEdge.leakageDetected
          )
      );
    }

    // Calculate MST
    const mstEdges = calculateMST(nodes, filteredEdges);

    // Prepare visualization data
    const visNodes = new DataSet(
      nodes.map((node) => ({
        id: node.id,
        label: `Node ${node.id}`,
        shape: "dot",
        size: 20,
        color: {
          border: "#2B7CE9",
          background: "#97C2FC",
          highlight: {
            border: "#2B7CE9",
            background: "#D2E5FF",
          },
          hover: {
            border: "#2B7CE9",
            background: "#D2E5FF",
          },
        },
        font: { color: "#333" },
      }))
    );

    const visEdges = new DataSet(
      mstEdges.map((edge) => {
        const hasLeakage = pipesWithLeakage.some(
          (leakageEdge) =>
            leakageEdge.source === edge.source &&
            leakageEdge.target === edge.target &&
            leakageEdge.leakageDetected
        );
        return {
          from: edge.source,
          to: edge.target,
          color: {
            color: hasLeakage ? "#FF6B6B" : "#51C454",
            highlight: hasLeakage ? "#FF8E8E" : "#7AE582",
            hover: hasLeakage ? "#FF8E8E" : "#7AE582",
          },
          width: hasLeakage ? 4 : 2,
          smooth: {
            type: "continuous",
            roundness: 0.5,
          },
          arrows: {
            to: {
              enabled: false,
            },
          },
        };
      })
    );

    setGraphData({ nodes: visNodes, edges: visEdges });
    setIsLoading(false);
  }, [selectedDataset, actualPressures, pressureThreshold, showOptimalGraph]);

  useEffect(() => {
    if (graphData.nodes.length && graphData.edges.length) {
      const container = document.getElementById("leak-graph-network");
      const data = {
        nodes: graphData.nodes,
        edges: graphData.edges,
      };
      const options = {
        nodes: {
          font: {
            size: 14,
            color: "#2D3748",
            strokeWidth: 0,
            face: "Roboto",
          },
          borderWidth: 2,
          shadow: {
            enabled: true,
            color: "rgba(0,0,0,0.2)",
            size: 10,
            x: 5,
            y: 5,
          },
        },
        edges: {
          width: 2,
          shadow: {
            enabled: true,
            color: "rgba(0,0,0,0.1)",
            size: 10,
            x: 5,
            y: 5,
          },
        },
        physics: {
          barnesHut: {
            gravitationalConstant: -2000,
            centralGravity: 0.3,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0.1,
          },
          stabilization: {
            iterations: 250,
          },
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
          zoomView: true,
          dragNodes: true,
          keyboard: {
            enabled: true,
            speed: { x: 10, y: 10, zoom: 0.02 },
          },
        },
      };

      new Network(container, data, options);
    }
  }, [graphData]);

  return (
    <div className="leak-graph-container">
      <div className="graph-header">
        <h2 className="graph-title">
          <span className="title-icon">🌊 Leakage Detection System</span>

        </h2>
        <div className="graph-controls">
          <div className="dataset-selector">
            <label className="selector-label">Dataset:</label>
            <div className="custom-select">
              <select value={selectedDataset} onChange={handleDatasetChange}>
                <option value="1">Dataset 1</option>
                <option value="2">Dataset 2</option>
                <option value="3">Dataset 3</option>
              </select>
              <div className="select-arrow">▼</div>
            </div>
          </div>

          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showOptimalGraph}
              onChange={(e) => setShowOptimalGraph(e.target.checked)}
            />
             <span className="slider round"></span>
            <span className="toggle-label">Optimal Graph</span>
          </label>
        </div>
      </div>

      {isLoading ? (
        <div className="graph-loading">
          <div className="loading-spinner"></div>
          <p>Generating network visualization...</p>
        </div>
      ) : (
        <div id="leak-graph-network" className="network-container"></div>
      )}

      <div className="graph-legend">
        <div className="legend-item">
          <div className="legend-color normal"></div>
          <span>Normal Pipe</span>
        </div>
        <div className="legend-item">
          <div className="legend-color leak"></div>
          <span>Leaking Pipe</span>
        </div>
      </div>
    </div>
  );
}

export default LeakGraph;
