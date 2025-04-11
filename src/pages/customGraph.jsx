import React, { useEffect, useRef, useState } from "react";
import { DataSet, Network } from "vis-network/standalone/esm/vis-network";
import '../components/style/CustomGraph.css'; // Import the CSS file

function CustomGraph({ graphData }) {
  const networkRef = useRef(null);
  const networkInstance = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Node color mapping based on zoneType
  const getNodeColor = (zoneType) => {
    const colors = {
      Agricultural: '#7CFC00',
      Industrial: '#FFD700',
      Urban: '#4682B4',
      source: '#3B82F6',
      default: '#D3D3D3'
    };
    return colors[zoneType] || colors.default;
  };

  useEffect(() => {
    if (!networkRef.current || !graphData?.nodes?.length) return;

    setIsLoading(true);

    const visNodes = new DataSet(
      graphData.nodes.map(node => ({
        ...node,
        label: node.label || node.zoneType || `Node ${node.id}`,
        color: {
          border: '#2B7CE9',
          background: getNodeColor(node.zoneType),
          highlight: {
            border: '#FFA500',
            background: '#FFD700'
          },
          hover: {
            border: '#2B7CE9',
            background: '#D2E5FF'
          }
        },
        shape: 'dot',
        size: 25,
        font: {
          size: 14,
          face: 'Roboto',
          color: '#2D3748',
          strokeWidth: 0,
          multi: true
        },
        borderWidth: 2,
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.2)',
          size: 10,
          x: 5,
          y: 5
        }
      }))
    );

    const visEdges = new DataSet(
      graphData.edges.map(edge => ({
        ...edge,
        width: 2,
        color: {
          color: '#4B5563',
          highlight: '#FF6B6B',
          hover: '#7AE582'
        },
        smooth: {
          type: 'continuous',
          roundness: 0.5
        },
        font: {
          size: 12,
          strokeWidth: 0,
          color: '#4B5563',
          align: 'top'
        },
        arrows: {
          to: {
            enabled: false
          }
        },
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.1)',
          size: 10,
          x: 5,
          y: 5
        }
      }))
    );

    const data = { nodes: visNodes, edges: visEdges };
    const options = {
      nodes: {
        fixed: {
          x: false,
          y: false
        }
      },
      edges: {
        selectionWidth: 3
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.3,
          springLength: 95,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0.1
        },
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 25
        }
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        hideEdgesOnDrag: false,
        hideNodesOnDrag: false,
        keyboard: {
          enabled: true,
          speed: { x: 10, y: 10, zoom: 0.02 },
          bindToWindow: true
        },
        zoomView: true,
        dragView: true
      }
    };

    if (networkInstance.current) {
      networkInstance.current.setData(data);
      networkInstance.current.setOptions(options);
    } else {
      networkInstance.current = new Network(networkRef.current, data, options);
      
      // Add event listeners
      networkInstance.current.on("stabilizationIterationsDone", () => {
        setIsLoading(false);
      });

      networkInstance.current.on("zoom", (params) => {
        setZoomLevel(params.scale.toFixed(2));
      });
    }

    return () => {
      if (networkInstance.current) {
        networkInstance.current.off("stabilizationIterationsDone");
        networkInstance.current.off("zoom");
      }
    };
  }, [graphData]);

  const handleFitView = () => {
    if (networkInstance.current) {
      networkInstance.current.fit({
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuad'
        }
      });
    }
  };

  return (
    <div className="custom-graph-container">
      {isLoading && (
        <div className="graph-loading-overlay">
          <div className="loading-spinner"></div>
          <p>Building network visualization...</p>
        </div>
      )}
      
      <div className="graph-controls">
        <button onClick={handleFitView} className="control-button">
          <span className="button-icon">🔍</span> Fit View
        </button>
        <div className="zoom-level">Zoom: {zoomLevel}x</div>
      </div>
      
      <div 
        ref={networkRef} 
        className="network-graph"
      />
      
      <div className="graph-legend">
        <div className="legend-title">Node Types:</div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#3B82F6' }}></div>
            <span>Source</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#4682B4' }}></div>
            <span>Urban</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FFD700' }}></div>
            <span>Industrial</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#7CFC00' }}></div>
            <span>Agricultural</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomGraph;