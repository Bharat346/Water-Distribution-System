// src/components/LeakDetection.jsx
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

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDatasetChange = (event) => {
    setSelectedDataset(parseInt(event.target.value, 10));
  };

  const actualPressures = {
    dataset1: {
      1: 21000, 2: 1280, 3: 23300, 4: 1800, 5: 19205,
      6: 1850, 7: 12485, 8: 1950, 9: 24100, 10: 2020,
      11: 19950, 12: 2005, 13: 21015, 14: 2200, 15: 20670
    },
    dataset2: {
      1: 20500, 2: 1300, 3: 23000, 4: 1900, 5: 19300,
      6: 1900, 7: 12000, 8: 2000, 9: 24200, 10: 2100,
      11: 19800, 12: 2100, 13: 21500, 14: 2200, 15: 20800
    },
    dataset3: {
      1: 21500, 2: 1250, 3: 23500, 4: 1700, 5: 19000,
      6: 1800, 7: 13000, 8: 2100, 9: 23900, 10: 2150,
      11: 20200, 12: 2150, 13: 21200, 14: 2250, 15: 21000
    }
  };
  const pressureThreshold = 500;

  if (!datasets[selectedDataset]) {
    return (
      <div className="error-card">
        <div className="error-icon">⚠️</div>
        <div className="error-message">Invalid dataset selected</div>
      </div>
    );
  }

  const selectedActualPressures = actualPressures[`dataset${selectedDataset}`];

  const mstEdges = useMemo(() => {
    return calculateMST(datasets[selectedDataset].nodes, datasets[selectedDataset].edges);
  }, [selectedDataset]);

  const pipesWithLeakage = useMemo(() => {
    const allPipes = calc_pressure_diff(
      datasets[selectedDataset].nodes,
      datasets[selectedDataset].edges,
      selectedActualPressures
    );
    const mstEdgesSet = new Set(mstEdges.map(edge => `${edge.source}-${edge.target}`));
    return allPipes.filter(pipe => mstEdgesSet.has(`${pipe.source}-${pipe.target}`));
  }, [selectedDataset, mstEdges]);

  return (
    <div className="leak-detection">
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-icon">🔍</span>
          Leak Detection Analysis
        </h2>
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

      <div className="analysis-container">
        <div className="leak-table-container">
          <div className="table-header">
            <h3>Pipe Pressure Analysis</h3>
            <div className="pressure-threshold">
              Threshold: <span>{pressureThreshold} pa</span>
            </div>
          </div>
          <div className="table-scroll-container">
            <table className="leak-table">
              <thead>
                <tr>
                  <th>Source → Target</th>
                  <th>Theoretical ΔP</th>
                  <th>Actual ΔP</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pipesWithLeakage.map(pipe => (
                  <tr key={`${pipe.source}-${pipe.target}`}>
                    <td>{pipe.source} → {pipe.target}</td>
                    <td>{pipe.theoreticalPressureDiff} pa</td>
                    <td>{pipe.actualPressureDiff} pa</td>
                    <td>
                      <span className={`status-badge ${pipe.leakageDetected ? 'leak' : 'normal'}`}>
                        {pipe.leakageDetected ? 'LEAK' : 'OK'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="leak-graph-container">
          <LeakGraph 
            actualPressures={selectedActualPressures}
            pressureThreshold={pressureThreshold}
            windowSize={windowSize}
          />
        </div>
      </div>
    </div>
  );
}

export default LeakDetection;