import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Profile.css";

function Profile() {
  const { userId } = useParams(); // Recupera o userId da URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false); // Estado para seguir/deixar de seguir
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId"); // ID do usuário logado

  // Redireciona para a URL com o userId se o usuário estiver acessando o próprio perfil
  useEffect(() => {
    if (!userId && loggedInUserId) {
      navigate(`/profile/${loggedInUserId}`); // Redireciona para a URL com o userId
    }
  }, [userId, loggedInUserId, navigate]);

  // Carregar os dados do perfil e verificar se o usuário logado já segue o perfil visitado
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return; // Não faz a requisição se o userId não estiver definido

      try {
        // Busca os dados do perfil
        const userResponse = await axios.get(`/api/users/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(userResponse.data);

        // Verifica se o usuário logado já segue o perfil visitado
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

  // Função para seguir um usuário
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
      setIsFollowing(true); // Atualiza o estado para "seguindo"
    } catch (error) {
      console.error("Erro ao seguir usuário:", error);
    }
  };

  // Função para deixar de seguir um usuário
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
      setIsFollowing(false); // Atualiza o estado para "não seguindo"
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

  return (
    <div className="profile-container">
      <div className="profile-header">
        {user.profile_picture ? (
          <img
            src={user.profile_picture}
            alt="Profile"
            className="profile-photo"
          />
        ) : (
          <FaUserCircle className="user-photo-profile" size={100} />
        )}
        <h1>
          {user.first_name} {user.last_name}
        </h1>
        <p>{user.bio}</p>

        {/* Botão de "Seguir" ou "Deixar de Seguir" */}
        {userId !== loggedInUserId && (
          isFollowing ? (
            <button onClick={handleUnfollow} className="unfollow-button">
              Deixar de seguir
            </button>
          ) : (
            <button onClick={handleFollow} className="follow-button">
              Seguir
            </button>
          )
        )}
      </div>

      {/* Restante do conteúdo do perfil */}
      <div className="profile-content">
        <p>Seguidores: {user.followers_count}</p>
        <p>Seguindo: {user.following_count}</p>
        {/* Adicione mais informações do perfil aqui */}
      </div>
    </div>
  );
}

export default Profile;