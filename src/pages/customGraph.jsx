import React, { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";

function CustomGraph({ graphData }) {
  const networkRef = useRef(null);
  const networkInstance = useRef(null);

  useEffect(() => {
    if (networkRef.current) {
      const visNodes = new DataSet(graphData.nodes.map((node) => ({
        ...node,
        label: node.label || node.zoneType,
      })));
      const visEdges = new DataSet(graphData.edges);

      const data = { nodes: visNodes, edges: visEdges };
      const options = {
        nodes: {
          shape: "dot",
          size: 30,  // Adjust node size
          color: {
            border: '#2B7CE9',  // Border color for nodes
            background: '#D3D3D3',  // Default node background color
            highlight: { background: '#FFD700', border: '#FFA500' },  // Node highlight color
          },
          font: {
            size: 14,
            color: "#333",
            face: "arial",
            multi: true,
          },
        },
        edges: {
          font: { color: "#343a40", strokeWidth: 0, align: "horizontal" },
          width: 2,
          color: {
            color: '#000000', 
            highlight: 'red',   
            hover: '#FFA07A', 
          },
          smooth: { enabled: false },
        },
        interaction: {
          hover: true,
          tooltipDelay: 200,
          zoomView: true,
          dragNodes: true,
        },
        physics: {
          enabled: false,
        },
      };

      // Destroy previous instance to avoid duplicates
      if (networkInstance.current) {
        networkInstance.current.destroy();
      }

      // Create new network instance
      networkInstance.current = new Network(networkRef.current, data, options);
    }
  }, [graphData]);

  return (
    <div
      ref={networkRef}
      style={{ height: "500px", width: "100%", border: "1px solid lightgray" }}
    />
  );
}

export default CustomGraph;
