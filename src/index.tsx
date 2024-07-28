import React from "react";
import ReactDOM from "react-dom/client";
import FlowDiagram from "./FlowDiagram";
import "./styles/tailwind.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <FlowDiagram />
  </React.StrictMode>
);
