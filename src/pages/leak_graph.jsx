// src/components/LeakGraph.jsx
import React, { useEffect, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import { calc_pressure_diff } from '../utils/checkPressure.js';
import { calculateMST } from '../utils/mst.js';
import { datasets } from '../../public/data';
import { useDataset } from '../pages/dataSetContext';
import '../components/style/leak_detection.css';
import '../components/style/leak_graph.css';

function LeakGraph({ actualPressures, pressureThreshold }) {
  const { selectedDataset, setSelectedDataset } = useDataset();
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [showOptimalGraph, setShowOptimalGraph] = useState(false);

  useEffect(() => {
    if (selectedDataset == null) {
      setSelectedDataset(1); // Set default dataset if not selected
    }
  }, [selectedDataset, setSelectedDataset]);

  const handleDatasetChange = (event) => {
    setSelectedDataset(parseInt(event.target.value));
  };

  useEffect(() => {
    if (!datasets[selectedDataset]) return;

    const nodes = datasets[selectedDataset].nodes;
    const edges = datasets[selectedDataset].edges;

    // Calculate leaking edges based on actual pressures
    const pipesWithLeakage = calc_pressure_diff(nodes, edges, actualPressures);

    // Filter edges if the optimal graph checkbox is checked
    let filteredEdges = edges;
    if (showOptimalGraph) {
      filteredEdges = edges.filter((edge) =>
        !pipesWithLeakage.some(
          (leakageEdge) =>
            leakageEdge.source === edge.source &&
            leakageEdge.target === edge.target &&
            leakageEdge.leakageDetected
        )
      );
    }

    // Calculate MST using filtered edges (considering or ignoring leakage)
    const mstEdges = calculateMST(nodes, filteredEdges);

    // Prepare nodes for visualization
    const visNodes = new DataSet(
      nodes.map((node) => ({
        id: node.id,
        label: `Node ${node.id}`,
        shape: 'dot',
        color: 'lightblue',
      }))
    );

    // Prepare edges for visualization with leak indication
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
          color: hasLeakage ? 'red' : 'green', // Red for leakage, green for normal
          width: hasLeakage ? 4 : 2,
        };
      })
    );

    setGraphData({ nodes: visNodes, edges: visEdges });
  }, [selectedDataset, actualPressures, pressureThreshold, showOptimalGraph]);

  const handleCheckboxChange = (e) => {
    setShowOptimalGraph(e.target.checked);
  };

  useEffect(() => {
    if (graphData.nodes.length && graphData.edges.length) {
      const container = document.getElementById('leak_graph-leakage-network');
      const data = {
        nodes: graphData.nodes,
        edges: graphData.edges,
      };
      const options = {
        nodes: {
          font: { size: 14, color: 'black' },
        },
        edges: {
          width: 2,
        },
        physics: {
          enabled: true,
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
          zoomView: false,
          dragNodes: true,
        },
      };
      new Network(container, data, options);
    }
  }, [graphData]);

  return (
    <div className="leak_graph-container">
      <h2>(3) Leakage Graph/MST and Solution Graph/MST</h2>
      
      {/* Dataset selection section */}
      <div className="leak_graph-dataset-selection">
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

      {/* Checkbox for toggling the optimal graph view */}
      <div className="leak_graph-checkbox-section">
        <label>
          <input
            type="checkbox"
            name="New_Optimal_Graph"
            checked={showOptimalGraph}
            onChange={handleCheckboxChange}
          />
          New Optimal Graph (without leaking edges)
        </label>
      </div>

      <div id="leak_graph-leakage-network" />
    </div>
  );
}

export default LeakGraph;
