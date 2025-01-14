import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // Importe a biblioteca js-cookie
import { useNavigate } from "react-router-dom";

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica do email
    if (!email || !email.includes("@")) {
      setError("Por favor, insira um email válido.");
      return;
    }

    try {
      // Obtenha o token CSRF do cookie
      const csrfToken = Cookies.get("csrftoken");

      const response = await axios.post(
        "http://localhost:8000/api/password-reset/",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken, // Inclua o token CSRF no cabeçalho
          },
          withCredentials: true, // Envie cookies junto com a requisição
        }
      );

      if (response.status === 200) {
        setMessage("Email enviado com sucesso! Verifique sua caixa de entrada.");
        setError("");
        // Redireciona para a página de confirmação após 3 segundos
        setTimeout(() => {
          navigate("/request-password-reset/done");
        }, 3000);
      }
    } catch (err) {
      console.error("Erro:", err.response ? err.response.data : err.message);
      setError(
        err.response?.data?.error ||
          "Erro ao solicitar redefinição de senha. Verifique o email e tente novamente."
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
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          Solicitar Redefinição
        </button>
      </form>
    </div>
  );
};

export default RequestPasswordReset;