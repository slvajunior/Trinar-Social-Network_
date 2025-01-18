// src/components/UserProfile.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProfilePictureUpload from "./ProfilePictureUpload";
import EditProfileForm from "./EditProfileForm";
import "./UserProfile.css"; // Estilização (opcional)

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar a edição
  const { userId } = useParams(); // Obtém o ID do usuário da URL

  // Busca os dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8000/api/auth/user/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setError("Erro ao carregar dados do usuário.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Função para atualizar os dados do usuário após edição
  const handleUpdate = (updatedUser) => {
    setUser(updatedUser); // Atualiza o estado do usuário
    setIsEditing(false); // Sai do modo de edição
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="user-profile">
      <h1>Perfil de {user.first_name} {user.last_name}</h1>

      {/* Foto de perfil */}
      <div className="profile-picture-section">
        <ProfilePictureUpload user={user} onUpdate={handleUpdate} />
      </div>

      {/* Informações do usuário ou formulário de edição */}
      {isEditing ? (
        <EditProfileForm user={user} onUpdate={handleUpdate} />
      ) : (
        <div className="user-info">
          <p><strong>Nome:</strong> {user.first_name} {user.last_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Data de Nascimento:</strong> {user.birth_date}</p>
          <p><strong>Seguidores:</strong> {user.followers_count}</p>
          <p><strong>Seguindo:</strong> {user.following_count}</p>
        </div>
      )}

      {/* Botão para editar perfil */}
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? "Cancelar" : "Editar Perfil"}
      </button>
    </div>
  );
};

export default UserProfile;