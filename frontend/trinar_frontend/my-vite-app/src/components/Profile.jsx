import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaBirthdayCake, FaCalendarAlt } from "react-icons/fa"; // Ícones
import "./Profile.css";

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
        {/* Foto de capa */}
        <div className="cover-photo-container">
          {profileData.cover_photo && (
            <img
              className="cover-photo"
              src={`http://localhost:8000${profileData.cover_photo}`}
              alt="Foto de capa"
            />
          )}
        </div>

        {/* Foto de perfil */}
        <div className="profile-picture-wrapper">
          <div className="profile-picture-container">
            {profileData.profile_picture && (
              <img
                className="profile-picture"
                src={`http://localhost:8000${profileData.profile_picture}`}
                alt="Foto de perfil"
              />
            )}
          </div>
        </div>

        {/* Conteúdo do perfil */}
        <div className="profile-content">
          <h1>
            {profileData.first_name} {profileData.last_name}
          </h1>

          {/* Contadores de seguidores */}
          <div className="profile-stats">
            <span>{profileData.following_count} Seguindo</span>{" "}
            <span>{profileData.followers_count} Seguidores</span>
          </div>

          {/* Biografia */}
          <div className="profile-bio">
            <p>{profileData.bio || "Nenhuma biografia fornecida."}</p>
          </div>

          {/* Detalhes (Localidade, Nascimento e Ingresso) */}
          <div className="profile-details">
            {profileData.location && (
              <span>
                <FaMapMarkerAlt /> {profileData.location}
              </span>
            )}
            {profileData.birth_date && (
              <span>
                <FaBirthdayCake /> Nascido(a) em{" "}
                {new Date(profileData.birth_date).toLocaleDateString()}
              </span>
            )}
            <span>
              <FaCalendarAlt /> Ingressou em{" "}
              {new Date(profileData.date_joined).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
  
  );
};

export default Profile;
