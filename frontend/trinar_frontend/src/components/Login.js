// src/components/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8000/api/token/", {
        username: formData.username,
        password: formData.password,
      });
      localStorage.setItem("accessToken", response.data.access); // Armazena o token JWT
      localStorage.setItem("refreshToken", response.data.refresh); // Armazena o refresh token
      setSuccess("Login realizado com sucesso! Redirecionando...");
      setTimeout(() => {
        navigate("/"); // Redireciona para a página inicial após o login
      }, 2000); // Redireciona após 2 segundos
    } catch (err) {
      setError("Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Nome de usuário"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Senha"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;