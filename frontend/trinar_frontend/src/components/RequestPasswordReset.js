// frontend/trinar_frontend/src/components/RequestPasswordReset.js

import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const csrfToken = Cookies.get("csrftoken");
      const response = await axios.post(
        "http://localhost:8000/api/password-reset/",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );

      // Verifica a resposta da requisição
      console.log("Resposta do servidor:", response.data);

      setMessage("Email enviado com sucesso! Verifique sua caixa de entrada.");
      setError("");
    } catch (err) {
      console.error("Erro:", err.response ? err.response.data : err.message);
      setError(
        "Erro ao solicitar redefinição de senha. Verifique o email e tente novamente."
      );
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Redefinir Senha</h2>
      {/* Mensagens de sucesso ou erro */}
      {message && <p style={{ color: "green" }}>{message}</p>}{" "}
      {/* Mensagem de sucesso */}
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Mensagem de erro */}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Solicitar Redefinição</button>
      </form>
    </div>
  );
};

export default RequestPasswordReset;
