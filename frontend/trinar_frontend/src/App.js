// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota para a página inicial */}
        <Route path="/" element={<Home />} />

        {/* Rota para a página de registro */}
        <Route path="/register" element={<Register />} />

        {/* Rota para a página de login */}
        <Route path="/login" element={<Login />} />

        {/* Rota para o logout */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;