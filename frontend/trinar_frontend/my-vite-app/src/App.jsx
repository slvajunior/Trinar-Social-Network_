// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { PostsProvider } from "./contexts/PostsContext"; // Importe o Provider
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
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";

function App() {
  const loggedInUserId = localStorage.getItem("userId");

  return (
    <PostsProvider> {/* Envolva o App com o Provider */}
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/email-confirmed" element={<EmailConfirmed />} />
            <Route path="/request-password-reset" element={<RequestPasswordReset />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
            <Route path="/request-password-reset/done" element={<RequestPasswordResetDone />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/" element={<Navigate to={`/profile/${loggedInUserId}`} replace />} />
            <Route path="*" element={<h1>Página não encontrada</h1>} />
          </Routes>
        </Layout>
      </Router>
    </PostsProvider>
  );
}

export default App;
