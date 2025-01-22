import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import Home from './components/Home';
import EmailConfirmed from './components/EmailConfirmed';
import RequestPasswordReset from './components/RequestPasswordReset';
import ResetPassword from './components/ResetPassword';
import RequestPasswordResetDone from './components/RequestPasswordResetDone';
import UserProfile from "./components/UserProfile";
import Layout from "./components/Layout"; // Importe o Layout

import Profile from './components/Profile';
import EditProfile from './components/EditProfile';

import '@fontsource/poppins/500.css'; // Peso 500 (medium)
import '@fontsource/poppins/700.css'; // Peso 700 (bold)
import '@fontsource/roboto/700.css'; // Peso 700 (bold)
import '@fontsource/roboto/500.css'; // Peso 500 (medium)

function App() {
  return (
    <Router>
      <Layout> {/* Envolve as rotas com o Layout */}
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/email-confirmed" element={<EmailConfirmed />} />
          <Route path="/request-password-reset" element={<RequestPasswordReset />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          <Route path="/request-password-reset/done" element={<RequestPasswordResetDone />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
