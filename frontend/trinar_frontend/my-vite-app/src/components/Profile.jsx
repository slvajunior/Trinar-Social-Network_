import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaBirthdayCake, FaCalendarAlt } from "react-icons/fa"; // Ícones
import "./Profile.css";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false); // Estado para seguir/deixar de seguir
  const navigate = useNavigate();
  const { id } = useParams(); // Captura o ID do perfil da URL (se existir)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("user_id"); // Recupera o user_id do localStorage

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      try {
        let profileResponse;
        if (id) {
          // Se houver um ID na URL, busca o perfil do usuário com esse ID
          profileResponse = await axios.get(`/api/users/profile/${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          // Se não houver ID, busca o perfil do usuário logado
          profileResponse = await axios.get(`/api/users/profile/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        setProfileData(profileResponse.data);

        // Verifica se o usuário logado já segue o perfil (apenas se não for o próprio perfil)
        if (id && profileResponse.data.id !== parseInt(userId)) {
          const followStatusResponse = await axios.get(
            `/api/users/${id}/is-following/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsFollowing(followStatusResponse.data.is_following);
        }

        setLoading(false);
      } catch (error) {
        setError("Erro ao carregar o perfil. Tente novamente.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, id]);

  const handleFollow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `/api/users/${id}/follow/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Atualiza o estado de seguir/deixar de seguir
      setIsFollowing(!isFollowing);
      console.log(response.data.message); // Exibe a mensagem de sucesso
    } catch (error) {
      console.error("Erro ao seguir/deixar de seguir:", error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const userId = localStorage.getItem("user_id"); // Recupera o user_id do localStorage
  const isOwnProfile = !id || profileData.id === parseInt(userId); // Verifica se é o próprio perfil

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

        {/* Botão Seguir/Deixar de seguir */}
        {!isOwnProfile && (
          <button onClick={handleFollow} className="follow-button">
            {isFollowing ? "Seguindo" : "Seguir"}
          </button>
        )}

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
