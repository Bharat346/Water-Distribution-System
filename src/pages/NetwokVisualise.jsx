// src/pages/NetworkVisualise.jsx

import React, { useEffect, useState } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import { calculateMST } from "../utils/mst";
import { datasets } from "../../public/data";
import { useDataset } from "./dataSetContext";
import "../components/style/network-visual-1.css";

function NetworkVisualizer({ windowSize }) {
  const { selectedDataset, setSelectedDataset } = useDataset();
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [networkInstance, setNetworkInstance] = useState(null); // To store the Network instance

  useEffect(() => {
    // Set default dataset if not selected
    if (selectedDataset == null) {
      setSelectedDataset(1); // Set default if not selected
    }
  }, [selectedDataset, setSelectedDataset]);

  const handleDatasetChange = (event) => {
    setSelectedDataset(parseInt(event.target.value));
  };

  useEffect(() => {
    if (!datasets[selectedDataset]) return;

    // Get nodes and edges from the selected dataset
    const nodes = datasets[selectedDataset].nodes;
    const edges = datasets[selectedDataset].edges;
    const mstEdges = calculateMST(nodes, edges);

    // Prepare the data for the graph
    const visNodes = new DataSet(
      nodes.map((node) => ({
        id: node.id,
        label: node.zoneType,
        title: `Density: ${node.density}\nWater Need: ${node.waterNeed}\nPressure: ${node.pressure}`,
        color: getNodeColor(node.zoneType),
        shape: "dot",
      }))
    );

    const visEdges = new DataSet(
      mstEdges.map((edge) => ({
        from: edge.source,
        to: edge.target,
        label: `Dist: ${edge.distance}`,
      }))
    );

    // Set graph data
    setGraphData({ nodes: visNodes, edges: visEdges });
  }, [selectedDataset]); // Effect hook will trigger on dataset change

  const getNodeColor = (zoneType) => {
    switch (zoneType) {
      case "Agricultural":
        return "#7CFC00";
      case "Industrial":
        return "#FFD700";
      case "Urban":
        return "#4682B4";
      case "source":
        return "rgb(10,200,350)";
      default:
        return "#D3D3D3";
    }
  };

  useEffect(() => {
    // Reinitialize the network graph when graphData or windowSize changes
    if (graphData.nodes.length && graphData.edges.length) {
      const container = document.getElementById("network");
      if (container) {
        const data = { nodes: graphData.nodes, edges: graphData.edges };
        const options = {
          nodes: { font: { size: 14, color: "black" }, borderWidth: 2 },
          edges: { width: 2, color: { inherit: true } },
          physics: { enabled: true },
          interaction: { hover: true, tooltipDelay: 200, zoomView: false, dragNodes: true },
        };

        // Create a new Network graph instance or update the existing one
        if (networkInstance) {
          networkInstance.setData(data); // Update the existing instance with new data
          networkInstance.redraw(); // Redraw the network to adjust it to the new data
        } else {
          const network = new Network(container, data, options);
          setNetworkInstance(network); // Store the network instance
        }
      }
    }
  }, [graphData, windowSize, networkInstance]); // Re-render when graphData, windowSize, or networkInstance changes

  return (
    <div className="network-container">
      <h2 className="network-heading">(1) Water Distribution Network</h2>
      <div className="network-dataset-selection">
        <span>Select dataset: </span>
        <label>
          <input
            type="radio"
            value={1}
            checked={selectedDataset === 1}
            onChange={handleDatasetChange}
          />
          Dataset-1
        </label>
        <label>
          <input
            type="radio"
            value={2}
            checked={selectedDataset === 2}
            onChange={handleDatasetChange}
          />
          Dataset-2
        </label>
        <label>
          <input
            type="radio"
            value={3}
            checked={selectedDataset === 3}
            onChange={handleDatasetChange}
          />
          Dataset-3
        </label>
      </div>
      <div id="network" className="network-graph-container" />
    </div>
  );
}

export default NetworkVisualizer;
