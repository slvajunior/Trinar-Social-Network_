// src/components/Logout.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, CircularProgress } from "@mui/material";

const Logout = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Desconectando...");

  useEffect(() => {
    // Remove o token JWT do localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Exibe uma mensagem de sucesso
    setMessage("Logout realizado com sucesso! Redirecionando...");

    // Redireciona o usuário para a página de login após 2 segundos
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }, [navigate]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {message}
        </Typography>
        <CircularProgress />
      </Box>
    </Container>
  );
};

export default Logout;