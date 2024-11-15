import React, { createContext, useContext, useState } from 'react';

// Create the context
const DatasetContext = createContext();

// Create a custom hook to use the DatasetContext
export const useDataset = () => {
  return useContext(DatasetContext);
};

// Context Provider component
export const DatasetProvider = ({ children }) => {
  const [selectedDataset, setSelectedDataset] = useState(1); 

  return (
    <DatasetContext.Provider value={{ selectedDataset, setSelectedDataset }}>
      {children}
    </DatasetContext.Provider>
  );
};
