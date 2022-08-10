import React, { useState } from "react";
import { datasetGroups } from "../../../config";

export const Context = React.createContext({
  availableBlocks: null,
  setAvailableBlocks: null,
  fields: null,
  setFields: null,
  dataset: null,
  setDataset: null,
  availableDatasets: null,
  setAvailableDatasets: null,
  solution: null,
  setSolution: null,
});

export const ContextProvider = ({ children }) => {
  const [availableBlocks, setAvailableBlocks] = useState([6, 8, 8]);
  const [fields, setFields] = useState([[], [], [], [], []]);
  const [availableDatasets, setAvailableDatasets] = useState(datasetGroups);

  const [dataset, setDataset] = useState();
  const [solution, setSolution] = useState();

  return (
    <Context.Provider
      value={{
        availableBlocks,
        setAvailableBlocks,
        fields,
        setFields,
        dataset,
        setDataset,
        solution,
        setSolution,
        availableDatasets,
        setAvailableDatasets,
      }}
    >
      {children}
    </Context.Provider>
  );
};
