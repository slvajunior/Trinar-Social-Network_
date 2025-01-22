// frontend/trinar_frontend/src/components/ResetPassword.js

import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const csrfToken = Cookies.get("csrftoken");

      const response = await axios.post(
        `http://localhost:8000/api/password-reset-confirm/${uid}/${token}/`,
        { new_password: newPassword },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao redefinir a senha.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button type="submit">Redefinir Senha</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default ResetPassword;