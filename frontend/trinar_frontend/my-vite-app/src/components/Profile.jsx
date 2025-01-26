import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaBirthdayCake, FaCalendarAlt } from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const userId = parseInt(localStorage.getItem("userId")); // ID do usuário logado
  const isOwnProfile = id ? parseInt(id) === userId : true; // Verifica se o perfil é do próprio usuário

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token || !userId) {
        navigate("/login");
        return;
      }

      try {
        // Fetch dos dados do perfil
        const profileResponse = await axios.get(
          id ? `/api/users/profile/${id}/` : `/api/users/profile/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProfileData(profileResponse.data);

        // Verifica se o usuário atual segue o perfil visitado (caso não seja o próprio)
        if (!isOwnProfile) {
          const followStatusResponse = await axios.get(
            `/api/users/${id}/is-following/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setIsFollowing(followStatusResponse.data.is_following);
        }

        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar o perfil:", error);
        setError("Erro ao carregar o perfil. Tente novamente.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate, isOwnProfile, userId]);

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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsFollowing(!isFollowing); // Inverte o estado
      console.log(response.data.message);
    } catch (error) {
      console.error("Erro ao seguir/desseguir:", error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="cover-photo-container">
        {profileData.cover_photo && (
          <img
            className="cover-photo"
            src={`http://localhost:8000${profileData.cover_photo}`}
            alt="Foto de capa"
          />
        )}
      </div>

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

      <div className="profile-content">
        <h1>
          {profileData.first_name} {profileData.last_name}
        </h1>

        <div className="profile-stats">
          <span>{profileData.following_count} Seguindo</span>{" "}
          <span>{profileData.followers_count} Seguidores</span>
        </div>

        {/* Botão de seguir, renderizado se não for o próprio perfil */}
        {!isOwnProfile && (
          <button
            onClick={handleFollow}
            className={`follow-button ${isFollowing ? "following" : ""}`}
          >
            {isFollowing ? "Seguindo" : "Seguir"}
          </button>
        )}

        <div className="profile-bio">
          <p>{profileData.bio || "Nenhuma biografia fornecida."}</p>
        </div>

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
