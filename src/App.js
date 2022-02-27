import React, { useState } from "react";
import { ChartPresenter } from "./components/ChartPresenter";
import { Switcher } from "./components/Switcher";
import { Chart, Bars, YAxis } from "./components/MinimalCharts";
import { globalEmissions } from "./config";
import cn from "./app.module.css";
import { InteractiveBarChart } from "./components/InteractiveBarChart";

function App() {
  const [selected, setSelected] = useState(0);

  return (
    <div className={cn.container}>
      <div className={cn.switcherContainer}>
        <Switcher
          options={[
            { label: "interactive", onClick: () => setSelected(0) },
            { label: "plane", onClick: () => setSelected(1) },
          ]}
        />
      </div>
      <main className={cn.main}>
        {selected === 0 ? (
          <InteractiveBarChart config={globalEmissions} />
        ) : (
          <ChartPresenter title={globalEmissions.title}>
            <Chart getX={d => d[globalEmissions.xKey]} getY={d => d[globalEmissions.yKey]}>
              <Bars data={globalEmissions.data} />
              <YAxis />
            </Chart>
          </ChartPresenter>
        )}
      </main>
    </div>
  );
}

export default App;
