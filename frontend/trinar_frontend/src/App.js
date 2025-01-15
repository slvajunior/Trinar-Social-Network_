// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Home from "./components/Home";
import EmailConfirmed from "./components/EmailConfirmed";
import RequestPasswordReset from './components/RequestPasswordReset';
import ResetPassword from './components/ResetPassword';
import RequestPasswordResetDone from "./components/RequestPasswordResetDone";

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

        {/* Rota para Email-confirmed */}
        <Route path="/email-confirmed" element={<EmailConfirmed />} />

        {/* Rota para request-password */}
        <Route path="/request-password-reset" element={<RequestPasswordReset />} />

        {/* Rota para reset-password */}
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

        {/* Rota para RequestPasswordResetDone */}
        <Route
          path="/request-password-reset/done"
          element={<RequestPasswordResetDone />}
        />
      </Routes>
    </Router>
  );
}

export default App;