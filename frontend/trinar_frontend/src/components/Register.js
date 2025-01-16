// src/components/Register.js
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    agreeTerms: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!formData.agreeTerms) {
      setError("Você deve concordar com os termos e políticas.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8000/api/register/", {
        username: formData.email,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        birth_date: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
      });
      console.log("Usuário registrado:", response.data);
      setSuccess(
        "Registro realizado com sucesso! Redirecionando para o login..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao registrar usuário.");
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
          p: 3,
          mt: 0.5,
        }}
      >
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Crie uma conta
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" align="center">
          É rápido e fácil.
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
          {/* Nome e Sobrenome */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Nome"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Sobrenome"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Box>

          {/* Data de Nascimento */}
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Data de Nascimento
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Dia"
              name="birthDay"
              value={formData.birthDay}
              onChange={handleChange}
              type="number"
              inputProps={{ min: 1, max: 31 }}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Mês</InputLabel>
              <Select
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleChange}
                label="Mês"
                required
              >
                <MenuItem value="01">Janeiro</MenuItem>
                <MenuItem value="02">Fevereiro</MenuItem>
                <MenuItem value="03">Março</MenuItem>
                <MenuItem value="04">Abril</MenuItem>
                <MenuItem value="05">Maio</MenuItem>
                <MenuItem value="06">Junho</MenuItem>
                <MenuItem value="07">Julho</MenuItem>
                <MenuItem value="08">Agosto</MenuItem>
                <MenuItem value="09">Setembro</MenuItem>
                <MenuItem value="10">Outubro</MenuItem>
                <MenuItem value="11">Novembro</MenuItem>
                <MenuItem value="12">Dezembro</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Ano"
              name="birthYear"
              value={formData.birthYear}
              onChange={handleChange}
              type="number"
              inputProps={{ min: 1900, max: new Date().getFullYear() }}
              required
            />
          </Box>

          {/* Email */}
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

          {/* Senha e Confirmar Senha */}
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
          <TextField
            fullWidth
            margin="normal"
            label="Confirmar Senha"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* Termos e Políticas */}

          <Typography variant="body2" color="gray">
          
            Ao clicar em Cadastre-se, você concorda com nossos{" "}
            <Link
              to="/terms"
              style={{
                textDecoration: "none",
                color: "#01537D",
                cursor: "pointer",
                marginRight: 0,
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.target.style.textDecoration = "none"}
            >
              Termos de Serviço
            </Link>
            {" "}
            <Link
              to="/privacy"
              style={{
                textDecoration: "none",
                color: "#01537D",
                marginRight: 1,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.target.style.textDecoration = "none"}
            > 
              Política de Privacidade
            </Link>
    
            <Link
              to="/cookies"
              style={{
                textDecoration: "none",
                color: "#01537D",
                marginRight: 0,
                cursor: "pointer",
                fontStyle: "inherit",
              }} 
              onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
              onMouseLeave={(e) => e.target.style.textDecoration = "none"}
            > e
              Política de Cookies
            </Link>{" "}
          </Typography>

          {/* Botão de Cadastro */}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ mt: 3, mb: 2, background: "#00a400" }}
          >
            {loading ? "Cadastrando..." : "Cadastre-se"}
          </Button>

          {/* Link para o Login */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Já tem uma conta?{" "}
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Faça login
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
            to="/desenvolvedor"
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

export default Register;