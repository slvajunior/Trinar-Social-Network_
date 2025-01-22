// Trinar/frontend/trinar_frontend/my-vite-app/src/main.jsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/global.css";
import App from './App.jsx'
import '@fontsource/poppins/500.css'; // Peso 500 (medium)
import '@fontsource/poppins/700.css'; // Peso 700 (bold)
import '@fontsource/roboto/700.css'; // Peso 700 (bold)
import '@fontsource/roboto/500.css'; // Peso 500 (medium)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

