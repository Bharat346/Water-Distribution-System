import React, { useState, useEffect } from "react";
import calc_pipe_radius from "../utils/pipeRadius.js";
import { optimizePipe } from "../utils/optimal_pipe_size";
import { datasets } from "../../public/data";
import { useDataset } from "./dataSetContext";
import "../components/style/pipeOptimization.css";

const PipeOptimization = () => {
  const { selectedDataset, setSelectedDataset } = useDataset();
  const [pipes, setPipes] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedDataset !== null && datasets[selectedDataset]) {
      const currentDataset = datasets[selectedDataset];
      setNodes(currentDataset.nodes);
      setEdges(currentDataset.edges);
    }
  }, [selectedDataset]);

  const handlePipeOptimization = () => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedPipes = edges.map((pipe) => {
        const radius = calc_pipe_radius(pipe.flowRate);
        const optimizedPipe = optimizePipe(pipe);
        return {
          ...pipe,
          radius: Number(radius).toFixed(2),
          optimizedPipe: {
            ...optimizedPipe,
            pipeCapacity: optimizedPipe.pipeCapacity.toFixed(2),
          },
        };
      });
      setPipes(updatedPipes);
      setIsLoading(false);
    }, 800); // Simulate processing delay
  };

  const handleDatasetChange = (event) => {
    setSelectedDataset(parseInt(event.target.value));
    setPipes([]); // Clear previous results when dataset changes
  };

  return (
    <div className="pipe-optimization">
      <div className="section-header">
        <h1 className="section-title">
          <span className="title-icon">⚙️</span>
          Pipe Optimization System
        </h1>
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
      </div>

      <div className="content-grid">
        <div className="zones-section card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">🏙️</span>
              Zones Information
            </h2>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Zone Type</th>
                  <th>Density</th>
                  <th>Water Need</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((zone) => (
                  <tr key={zone.id}>
                    <td>{zone.id}</td>
                    <td>
                      <span
                        className={`zone-type ${zone.zoneType.toLowerCase()}`}
                      >
                        {zone.zoneType}
                      </span>
                    </td>
                    <td>{zone.density}</td>
                    <td>{zone.waterNeed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="optimization-section card">
          <div className="card-header">
            <h2 className="card-title">
              <span className="card-icon">📊</span>
              Pipe Optimization
            </h2>
            <button
              className="optimize-button"
              onClick={handlePipeOptimization}
              disabled={isLoading || edges.length === 0}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="button-icon">🔧</span>
                  Optimize Pipes
                </>
              )}
            </button>
          </div>

          {pipes.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Source → Target</th>
                    <th>Distance</th>
                    <th>Flow Rate</th>
                    <th>Radius</th>
                    <th>Optimized Capacity</th>
                    <th>Resized</th>
                  </tr>
                </thead>
                <tbody>
                  {pipes.map((pipe) => (
                    <tr key={`${pipe.source}-${pipe.target}`}>
                      <td>
                        {pipe.source} → {pipe.target}
                      </td>
                      <td>{pipe.distance}m</td>
                      <td>{pipe.flowRate}</td>
                      <td>{pipe.radius}m</td>
                      <td>
                        {pipe.optimizedPipe
                          ? pipe.optimizedPipe.pipeCapacity
                          : "-"}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            pipe.optimizedPipe?.resized ? "resized" : "original"
                          }`}
                        >
                          {pipe.optimizedPipe?.resized ? "Yes" : "No"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>
                Click "Optimize Pipes" to calculate pipe radii and optimization
                results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PipeOptimization;
