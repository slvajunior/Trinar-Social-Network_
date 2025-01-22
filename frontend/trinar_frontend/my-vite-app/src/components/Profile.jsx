import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css"; // Estilização (opcional)

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("/api/users/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
        setLoading(false);
      } catch (error) {
        setError("Erro ao carregar o perfil. Tente novamente.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="profile-container">
      {/* Contêiner para a foto de capa */}
      <div className="cover-photo-container">
        {profileData.cover_photo && (
          <img
            className="cover-photo"
            src={`http://localhost:8000${profileData.cover_photo}`}
            alt="Foto de capa"
          />
        )}
      </div>

      {/* Contêiner para a foto de perfil */}
      <div className="profile-picture-container">
        {profileData.profile_picture && (
          <img
            className="profile-picture"
            src={`http://localhost:8000${profileData.profile_picture}`}
            alt="Foto de perfil"
          />
        )}
      </div>

      {/* Conteúdo do perfil (h1 e biografia) */}
      <div className="profile-content">
        <h1>Perfil do Usuário</h1>
        <p>
          Nome: {profileData.first_name} {profileData.last_name}
        </p>
        <p>Biografia: {profileData.bio || "Nenhuma biografia fornecida."}</p>
      </div>
    </div>
  );
};

export default Profile;