// src/components/EditProfileForm.jsx

import React, { useState } from "react";
import axios from "axios";
import { TextField, Button } from "@mui/material";

const EditProfileForm = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    birth_date: user.birth_date,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8000/api/auth/user/${user.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdate(response.data); // Atualiza os dados do usuário
      setLoading(false);
    } catch (error) {
      setError("Erro ao atualizar perfil. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        margin="normal"
        label="Nome"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Sobrenome"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        required
      />
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
        label="Data de Nascimento"
        type="date"
        name="birth_date"
        value={formData.birth_date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  );
};

export default EditProfileForm;