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
          marginTop: 5,
        }}
      >
        trinar
      </Typography>

      {/* Formulário */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: 3,
          p: 5,
          mt: 2,
        }}
      >
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Login
        </Typography>

        {/* Mensagens de erro e sucesso */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

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

          {/* Links para Registro e Esqueceu a Conta */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "#1976d2", marginRight: 15, }}
            >
              Cadastre-se no Trinar
            </Link>
            {" "}
            <Link
              to="/request-password-reset"
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              Esqueceu a conta?
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          backgroundColor: "#ffffff",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          py: 6, // Adiciona algum padding vertical
        }}
      >
        <Typography variant="body2" color="textSecondary">
          © 2025 Trinar. Todos os direitos reservados.
        </Typography>

        <Box sx={{ mt: 1 }}>
          <Link
            to="/register"
            style={{
              textDecoration: "none",
              color: "gray",
              marginRight: 15,
            }}
          >
            Registrar
          </Link>
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "gray",
              marginRight: 15,
            }}
          >
            Entrar
          </Link>
          <Link
            to="/about"
            style={{
              textDecoration: "none",
              color: "gray",
              marginRight: 15,
            }}
          >
            Sobre
          </Link>
          <Link
            to="/messenger"
            style={{
              textDecoration: "none",
              color: "gray",
              marginRight: 15,
            }}
          >
            Messenger
          </Link>
          <Link
            to="/lite"
            style={{
              textDecoration: "none",
              color: "gray",
              marginRight: 15,
            }}
          >
            Trinar Lite
          </Link>
          <Link
            to="/pay"
            style={{
              textDecoration: "none",
              color: "gray",
              marginRight: 15,
            }}
          >
            Trinar Pay
          </Link>
          <Link
            to="/campanha"
            style={{
              textDecoration: "none",
              color: "gray",
              marginRight: 15,
            }}
          >
            Threads
          </Link>
          <Link
            to="/anuncio"
            style={{
              textDecoration: "none",
              color: "gray",
              marginRight: 15,
            }}
          >
            Desenvolvedores
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;