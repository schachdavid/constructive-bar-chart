import React from "react";

import { globalEmissions } from "./config";
import cn from "./app.module.css";
import { InteractiveBarChart } from "./components/InteractiveBarChart";

function App() {
  return (
    <div className={cn.container}>
      <InteractiveBarChart config={globalEmissions} />
    </div>
  );
}

export default App;
