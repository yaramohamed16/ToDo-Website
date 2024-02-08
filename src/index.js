// index.js

import React from "react";
import ReactDOM from "react-dom/client";
import ToDo from "./ToDo";
import reportWebVitals from "./reportWebVitals";
import swDev from "./swDev";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ToDo />
  </React.StrictMode>
);

reportWebVitals();
swDev();
