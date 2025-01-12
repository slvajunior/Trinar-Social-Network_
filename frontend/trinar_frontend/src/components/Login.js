// src/components/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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
    email: "",
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
        username: formData.email, // Usar o email como username
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
      {/* Cabeçalho */}
      <Typography
        variant="h2"
        component="h1"
        align="center"
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          mt: 4,
          mb: 2,
        }}
      >
        trinar
      </Typography>

      {/* Formulário */}
      <Box
        sx={{
          backgroundColor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          p: 4,
          mt: 2,
        }}
      >
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Login
        </Typography>

        {/* Mensagens de erro e sucesso */}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

        {/* Campos do Formulário */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            name="email"
            value={formData.email}
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

          {/* Link para o Registro */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Não tem uma conta?{" "}
            <Link to="/register" style={{ textDecoration: "none", color: "primary.main" }}>
              Cadastre-se
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="body2" color="textSecondary">
          © 2025 Trinar. Todos os direitos reservados.
        </Typography>
        {/* Futuros links do footer */}
        <Box sx={{ mt: 1 }}>
          <Link to="/register" style={{ textDecoration: "none", color: "primary.main", marginRight: 2 }}>
            Registrar
          </Link>
          <Link to="/login" style={{ textDecoration: "none", color: "primary.main", marginRight: 2 }}>
            Entrar
          </Link>
          <Link to="/about" style={{ textDecoration: "none", color: "primary.main", marginRight: 2 }}>
            Sobre
          </Link>
          <Link to="/messenger" style={{ textDecoration: "none", color: "primary.main" }}>
            Messenger
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;