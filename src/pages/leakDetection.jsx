import React, { useMemo, useState, useEffect } from "react";
import { calc_pressure_diff } from "../utils/checkPressure";
import { useDataset } from "./dataSetContext";
import { datasets } from "../../public/data";
import LeakGraph from "./leak_graph";
import "../components/style/leak_detection.css";
import { calculateMST } from "../utils/mst";

function LeakDetection() {
  const { selectedDataset, setSelectedDataset } = useDataset();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update window size state on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDatasetChange = (event) => {
    const datasetType = parseInt(event.target.value, 10);
    setSelectedDataset(datasetType);
  };

  const actualPressures = {
    dataset1: {
      1: 21000,
      2: 1280,
      3: 23300,
      4: 1800,
      5: 19205,
      6: 1850,
      7: 12485,
      8: 1950,
      9: 24100,
      10: 2020,
      11: 19950,
      12: 2005,
      13: 21015,
      14: 2200,
      15: 20670,
    },
    dataset2: {
      1: 20500,
      2: 1300,
      3: 23000,
      4: 1900,
      5: 19300,
      6: 1900,
      7: 12000,
      8: 2000,
      9: 24200,
      10: 2100,
      11: 19800,
      12: 2100,
      13: 21500,
      14: 2200,
      15: 20800,
    },
    dataset3: {
      1: 21500,
      2: 1250,
      3: 23500,
      4: 1700,
      5: 19000,
      6: 1800,
      7: 13000,
      8: 2100,
      9: 23900,
      10: 2150,
      11: 20200,
      12: 2150,
      13: 21200,
      14: 2250,
      15: 21000,
    },
  };
  const pressureThreshold = 500;

  if (!datasets[selectedDataset]) {
    console.error("Invalid dataset selected.");
    return <div>Error: Invalid dataset selected.</div>;
  }

  const selectedActualPressures = actualPressures[`dataset${selectedDataset}`];

  const mstEdges = useMemo(() => {
    const nodes = datasets[selectedDataset].nodes;
    const edges = datasets[selectedDataset].edges;
    return calculateMST(nodes, edges);
  }, [selectedDataset]);

  const pipesWithLeakage = useMemo(() => {
    const allPipes = calc_pressure_diff(
      datasets[selectedDataset].nodes,
      datasets[selectedDataset].edges,
      selectedActualPressures
    );

    const mstEdgesSet = new Set(
      mstEdges.map((edge) => `${edge.source}-${edge.target}`)
    );

    return allPipes.filter((pipe) =>
      mstEdgesSet.has(`${pipe.source}-${pipe.target}`)
    );
  }, [selectedDataset, mstEdges]);

  return (
    <div className="leak-detection-container">
      <h2>(2) Leak Detection</h2>
      <div className="dataset-selector">
        <label htmlFor="dataset">Select Dataset: </label>
        <select
          id="dataset"
          value={selectedDataset}
          onChange={handleDatasetChange}
        >
          <option value="1">Dataset 1</option>
          <option value="2">Dataset 2</option>
          <option value="3">Dataset 3</option>
        </select>
      </div>

      {/* Leak detection table */}
      <table className="leak-detection-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Target</th>
            <th>Pressure Difference Tolerance (pa)</th>
            <th>Theoretical Pressure Difference (pa)</th>
            <th>Actual Pressure Difference (pa)</th>
            <th>Leakage Status</th>
          </tr>
        </thead>
        <tbody>
          {pipesWithLeakage.length > 0 ? (
            pipesWithLeakage.map((pipe) => (
              <tr key={`${pipe.source}-${pipe.target}`}>
                <td>{pipe.source}</td>
                <td>{pipe.target}</td>
                <td>{pressureThreshold}</td>
                <td>{pipe.theoreticalPressureDiff}</td>
                <td>{pipe.actualPressureDiff}</td>
                <td className={pipe.leakageDetected ? "leak" : "no-leak"}>
                  {pipe.leakageDetected ? "Yes" : "No"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No pipes data available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Leak Graph */}
      <div className="leak-graph-container">
        <LeakGraph
          actualPressures={selectedActualPressures}
          pressureThreshold={pressureThreshold}
          windowSize={windowSize} 
        />
      </div>
    </div>
  );
}

export default LeakDetection;
