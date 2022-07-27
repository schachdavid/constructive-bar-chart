import React from "react";

import cn from "./app.module.css";
import { InteractiveBarChart } from "./components/InteractiveBarChart";

function App() {
  return (
    <div className={cn.container}>
      <InteractiveBarChart />
    </div>
  );
}

export default App;
