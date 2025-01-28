import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaCalendarAlt,
} from "react-icons/fa";
import "./Profile.css";

function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId && loggedInUserId) {
      navigate(`/profile/${loggedInUserId}`);
    }
  }, [userId, loggedInUserId, navigate]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;

      try {
        const userResponse = await axios.get(`/api/users/user/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(userResponse.data);

        const followStatusResponse = await axios.get(
          `/api/users/${userId}/is-following/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsFollowing(followStatusResponse.data.is_following);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, token]);

  const handleFollow = async () => {
    if (userId === loggedInUserId) {
      console.warn("Você não pode seguir a si mesmo.");
      return;
    }

    try {
      await axios.post(
        `/api/users/${userId}/follow/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFollowing(true);
    } catch (error) {
      console.error("Erro ao seguir usuário:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.post(
        `/api/users/${userId}/unfollow/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFollowing(false);
    } catch (error) {
      console.error("Erro ao deixar de seguir usuário:", error);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <div>Usuário não encontrado.</div>;
  }

  // Função para formatar a data
  const formatarData = (data) => {
    const meses = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];

    const dataObj = new Date(data);
    const dia = dataObj.getDate();
    const mes = meses[dataObj.getMonth()];
    const ano = dataObj.getFullYear();

    return `Nascido(a) em ${dia} de ${mes} de ${ano}`;
  };

  return (
    <div className="profile-page-container">
      {user.cover_photo ? (
        <div className="profile-page-cover">
          <img
            src={user.cover_photo}
            alt="Cover"
            className="profile-page-cover-photo"
          />
        </div>
      ) : (
        <div className="profile-page-default-cover">
          <p>Bem-vindo ao perfil!</p>
        </div>
      )}

      <div className="profile-page-header">
        {user.profile_picture ? (
          <img
            src={user.profile_picture}
            alt="Profile"
            className="profile-page-photo"
          />
        ) : (
          <FaUserCircle className="profile-page-default-photo" size={100} />
        )}
        <h1 className="profile-page-name">
          {user.first_name} {user.last_name}
        </h1>
        <p className="profile-page-bio">{user.bio}</p>

        {/* Informações adicionais */}
        <div className="profile-page-details">
          {user.location && (
            <p className="profile-page-detail">
              <FaMapMarkerAlt /> {user.location}
            </p>
          )}
          {user.birth_date && (
            <p className="profile-page-detail">
              <FaBirthdayCake /> {formatarData(user.birth_date)}
            </p>
          )}
          {user.date_joined && (
            <p className="profile-page-detail">
              <FaCalendarAlt /> Ingressou em{" "}
              {new Date(user.date_joined).toLocaleDateString()}
            </p>
          )}
          
        </div>
      </div>
      <hr className="profile-page-divider" /> {/* Linha divisória */}

      <div className="profile-page-content">
      {userId !== loggedInUserId && (
          <button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            className={
              isFollowing
                ? "profile-page-unfollow-button"
                : "profile-page-follow-button"
            }
          >
            {isFollowing ? "Desseguir" : "Seguir"}
          </button>
        )}

        <div className="profile-page-info">
          <p className="profile-page-stats"><strong className="number-follow">{user.following_count}</strong> Seguindo</p>
          <p className="profile-page-stats"><strong className="number-follow">{user.followers_count}</strong> Seguidores</p>
          </div>
      </div>
    </div>
  );
}

export default Profile;
