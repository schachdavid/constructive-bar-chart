import { useContext, useMemo } from "react";
import { Context } from "../Context";

import cn from "./index.module.css";

function sum(a, b) {
  return a + b;
}

export const MainDisplay = ({ width }) => {
  const { dataset, solution, fields } = useContext(Context);

  const progress = useMemo(() => {
    if (!fields || !solution || !dataset) return 0;
    const diff = fields
      .map((d) => d.reduce(sum, 0) * 2) // get num blocks
      .map((d, i) => d - solution[i])
      .map(Math.abs)
      .reduce(sum, 0);
    const value = Math.max(1 - diff / solution.reduce(sum, 0), 0);
    return Math.round(value * 100);
  }, [dataset, fields, solution]);

  let content = "Wähle einen Datensatz";
  if (dataset && !solution) {
    content = "Schätze die Daten";
  } else if (dataset && solution) {
    const left = progress - (progress === 100 ? 28 : 22) + "%";
    content = (
      <div className={cn.feedback}>
        <div className={cn.progressBar}>
          <div className={cn.progress} style={{ width: progress + "%" }} />
          <div
            className={
              progress < 75 ? cn.progressLabelRight : cn.progressLabelLeft
            }
            style={{ left }}
          >
            {progress}%
          </div>
        </div>
        {progress !== 100
          ? "Korrigiere die Schätzung"
          : "Super, alles richtig!"}
      </div>
    );
  }

  return (
    <div className={cn.mainDisplay} style={{ width }}>
      {content}
    </div>
  );
};
