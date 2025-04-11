// src/App.js

import React, { useState, useEffect } from "react";
import NetworkVisualizer from "./pages/NetwokVisualise.jsx";
import { DatasetProvider } from "./pages/dataSetContext.jsx";
import LeakDetection from "./pages/leakDetection.jsx";
import Header from "./pages/Header.jsx";
import LeakGraph from "./pages/leak_graph.jsx";
import PipeOptimization from "./pages/pipeOptimiztaion.jsx";
import "./App.css";

function App() {
  const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <DatasetProvider>
      <div className="App">
        <Header />
        <NetworkVisualizer windowSize={windowSize} />
        <LeakDetection />
        <PipeOptimization />
      </div>
    </DatasetProvider>
  );
}

export default App;
