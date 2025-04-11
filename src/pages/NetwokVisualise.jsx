// src/components/NetworkVisualizer.jsx
import React, { useEffect, useState } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import { calculateMST } from "../utils/mst";
import { datasets } from "../../public/data";
import { useDataset } from "./dataSetContext";
import "../components/style/network-visualizer.css";

function NetworkVisualizer({ windowSize }) {
  const { selectedDataset, setSelectedDataset } = useDataset();
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [networkInstance, setNetworkInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedDataset == null) setSelectedDataset(1);
  }, [selectedDataset, setSelectedDataset]);

  const handleDatasetChange = (event) => {
    setSelectedDataset(parseInt(event.target.value));
    setIsLoading(true);
  };

  useEffect(() => {
    if (!datasets[selectedDataset]) return;

    const nodes = datasets[selectedDataset].nodes;
    const edges = datasets[selectedDataset].edges;
    const mstEdges = calculateMST(nodes, edges);

    const visNodes = new DataSet(
      nodes.map((node) => ({
        id: node.id,
        label: `${node.id} (${node.zoneType})`,
        title: `Zone: ${node.zoneType}\nDensity: ${node.density}\nWater Need: ${node.waterNeed}\nPressure: ${node.pressure}`,
        color: getNodeColor(node.zoneType),
        shape: "dot",
        size: 20,
        font: { size: 14, face: "Roboto", color: "#2D3748" },
        borderWidth: 2,
        shadow: true,
      }))
    );

    const visEdges = new DataSet(
      mstEdges.map((edge) => ({
        from: edge.source,
        to: edge.target,
        label: `${edge.distance}m`,
        color: "#4B5563",
        width: 2,
        smooth: { type: "continuous" },
        font: { size: 12, strokeWidth: 0, color: "#4B5563" },
      }))
    );

    setGraphData({ nodes: visNodes, edges: visEdges });
    setIsLoading(false);
  }, [selectedDataset]);

  const getNodeColor = (zoneType) => {
    const colors = {
      Agricultural: "#7CFC00",
      Industrial: "#FFD700",
      Urban: "#4682B4",
      source: "#3B82F6",
      default: "#D3D3D3",
    };
    return colors[zoneType] || colors.default;
  };

  useEffect(() => {
    if (graphData.nodes.length && graphData.edges.length) {
      const container = document.getElementById("network");
      const data = { nodes: graphData.nodes, edges: graphData.edges };

      const options = {
        nodes: {
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
          stabilization: { iterations: 250 },
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

      if (networkInstance) {
        networkInstance.setData(data);
        networkInstance.setOptions(options);
      } else {
        const network = new Network(container, data, options);
        setNetworkInstance(network);
      }
    }
  }, [graphData, windowSize, networkInstance]);

  return (
    <div className="network-visualizer">
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-icon">🌐</span>
          Water Distribution Network
        </h2>
        <div className="dataset-selector">
          <select
            className="dataset-select"
            value={selectedDataset}
            onChange={handleDatasetChange}
          >
            <option value="1">Dataset 1</option>
            <option value="2">Dataset 2</option>
            <option value="3">Dataset 3</option>
          </select>
          <div className="select-arrow">▼</div>
        </div>
      </div>

      <div className="network-container">
        {isLoading ? (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Generating network visualization...</p>
          </div>
        ) : null}
        <div id="network" className="network-graph"></div>
      </div>

      <div className="legend">
        <div className="legend-title">Zone Types:</div>
        <div className="legend-items">
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#3B82F6" }}
            ></div>
            <span>Source</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#4682B4" }}
            ></div>
            <span>Urban</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#FFD700" }}
            ></div>
            <span>Industrial</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: "#7CFC00" }}
            ></div>
            <span>Agricultural</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NetworkVisualizer;
