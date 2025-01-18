// src/components/ProfilePictureUpload.jsx

import React, { useState } from "react";
import axios from "axios";
import { FaUserCircle, FaUpload } from "react-icons/fa";
import "./ProfilePictureUpload.css"; // Estilização (opcional)

const ProfilePictureUpload = ({ user, onUpdate }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Armazena o arquivo selecionado
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Selecione uma foto para enviar.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("profile_picture", file); // Adiciona o arquivo ao FormData

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:8000/api/auth/upload-profile-picture/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Atualiza os dados do usuário após o upload
      onUpdate(response.data);
      setLoading(false);
    } catch (err) {
      setError("Erro ao enviar a foto. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="profile-picture-upload">
      <div className="profile-picture-preview">
        {user.profile_picture ? (
          <img
            src={user.profile_picture}
            alt="Foto de perfil"
            className="profile-picture"
          />
        ) : (
          <FaUserCircle size={100} className="default-profile-picture" />
        )}
      </div>

      <div className="upload-controls">
        <input
          type="file"
          id="profile-picture-input"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <label htmlFor="profile-picture-input" className="upload-button">
          <FaUpload /> Escolher foto
        </label>
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ProfilePictureUpload;