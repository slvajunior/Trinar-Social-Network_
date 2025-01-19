import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import '@fontsource/poppins/500.css'; // Peso 500 (medium)
import '@fontsource/poppins/700.css'; // Peso 700 (bold)
import '@fontsource/roboto/700.css'; // Peso 700 (bold)
import '@fontsource/roboto/500.css'; // Peso 500 (medium)

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);