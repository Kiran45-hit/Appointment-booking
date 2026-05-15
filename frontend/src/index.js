import React from "react";
import ReactDOM from "react-dom/client";

// ✅ Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// ✅ Bootstrap Icons
import "bootstrap-icons/font/bootstrap-icons.css";

// ✅ Global Styles
import "./index.css";

// ✅ Main App
import App from "./App";

// ✅ Performance Metrics
import reportWebVitals from "./reportWebVitals";

// =========================
// ROOT
// =========================

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

// =========================
// RENDER APP
// =========================

root.render(

  <React.StrictMode>

    <App />

  </React.StrictMode>
);

// =========================
// PERFORMANCE
// =========================

reportWebVitals();