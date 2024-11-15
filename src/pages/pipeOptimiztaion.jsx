import React, { useState, useEffect } from "react";
import calc_pipe_radius from "../utils/pipeRadius.js";
import { optimizePipe } from "../utils/optimal_pipe_size";
import { datasets } from "../../public/data"; // Import datasets
import { useDataset } from "./dataSetContext"; // Import useDataset hook
import '../components/style/pipe_optimize.css'; 

const PipeOptimization = () => {
  const { selectedDataset, setSelectedDataset } = useDataset(); // Access the selectedDataset
  const [pipes, setPipes] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    if (selectedDataset !== null && datasets[selectedDataset]) {
      // Fetch nodes and edges from the selected dataset
      const currentDataset = datasets[selectedDataset];
      setNodes(currentDataset.nodes);
      setEdges(currentDataset.edges);
    }
  }, [selectedDataset]);

  const handlePipeOptimization = () => {
    const updatedPipes = edges.map((pipe) => {
      const radius = calc_pipe_radius(pipe.flowRate);
      const optimizedPipe = optimizePipe(pipe);
      return {
        ...pipe,
        radius,
        optimizedPipe,
      };
    });

    setPipes(updatedPipes);
  };

  const handleDatasetChange = (event) => {
    setSelectedDataset(parseInt(event.target.value)); // Update the selected dataset
  };

  return (
    <div className="pipe-optimization-container">
      <h1>(4) Pipe Optimization and Radius Calculation</h1>

      <div>
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
      <br />

      <h2>Zones</h2>
      <table className="pipe-optimization-table">
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
              <td>{zone.zoneType}</td>
              <td>{zone.density}</td>
              <td>{zone.waterNeed}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Pipes</h2>
      <button className="optimize-button" onClick={handlePipeOptimization}>
        Optimize and Calculate Radius
      </button>
      <table className="pipe-optimization-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Target</th>
            <th>Distance</th>
            <th>Pipe Capacity</th>
            <th>Flow Rate</th>
            <th>Radius</th>
            <th>Optimized Pipe Capacity</th>
            <th>Resized</th>
          </tr>
        </thead>
        <tbody>
          {pipes.map((pipe) => (
            <tr key={`${pipe.source}-${pipe.target}`}>
              <td>{pipe.source}</td>
              <td>{pipe.target}</td>
              <td>{pipe.distance}</td>
              <td>{pipe.pipeCapacity}</td>
              <td>{pipe.flowRate}</td>
              <td>{pipe.radius}</td>
              <td>
                {pipe.optimizedPipe ? pipe.optimizedPipe.pipeCapacity : "-"}
              </td>
              <td className="optimized-pipe-column">
                {pipe.optimizedPipe
                  ? pipe.optimizedPipe.resized
                    ? "Yes"
                    : "No"
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PipeOptimization;
