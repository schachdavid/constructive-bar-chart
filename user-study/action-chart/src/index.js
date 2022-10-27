import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Chart from "./Chart";
import reportWebVitals from "./reportWebVitals";
import VideoPlayer from "./VideoPlayer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <VideoPlayer />
    <Chart />
  </React.StrictMode>
);

reportWebVitals();
