import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Home from "./components/Home";
import EmailConfirmed from "./components/EmailConfirmed";
import RequestPasswordReset from "./components/RequestPasswordReset";
import ResetPassword from "./components/ResetPassword";
import RequestPasswordResetDone from "./components/RequestPasswordResetDone";
import Timeline from "./components/Timeline";
import Layout from "./components/Layout";
import Profile from "./components/Profile"; // Usar apenas o Profile
import EditProfile from "./components/EditProfile";

function App() {
  const loggedInUserId = localStorage.getItem("userId"); // ID do usuário logado

  return (
    <Router>
      <Layout>
        <Routes>
          {/* Página principal */}
          <Route path="/" element={<Home />} />

          {/* Rotas relacionadas ao usuário */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* Confirmação e redefinição de senha */}
          <Route path="/email-confirmed" element={<EmailConfirmed />} />
          <Route path="/request-password-reset" element={<RequestPasswordReset />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          <Route path="/request-password-reset/done" element={<RequestPasswordResetDone />} />

          {/* Timeline */}
          <Route path="/timeline" element={<Timeline />} />

          {/* Perfil do usuário */}

          <Route path="/profile/:userId" element={<Profile />} /> {/* Usar Profile */}
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/" element={<Navigate to={`/profile/${loggedInUserId}`} replace />}/>
          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;