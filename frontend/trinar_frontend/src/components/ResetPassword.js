import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { uid, token } = useParams(); // Captura os parâmetros da URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação das senhas
    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (newPassword.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/password-reset-confirm/${uid}/${token}/`,
        {
          new_password: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Se necessário para autenticação
        }
      );

      if (response.status === 200) {
        setMessage("Senha redefinida com sucesso! Redirecionando para o login...");
        setError("");
        // Redireciona para a página de login após 3 segundos
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      console.error("Erro:", err.response ? err.response.data : err.message);
      setError(
        err.response?.data?.error ||
          "Erro ao redefinir a senha. Tente novamente."
      );
      setMessage("");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Redefinir Senha</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Nova Senha:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Confirmar Nova Senha:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            />
          </label>
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Redefinir Senha
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;