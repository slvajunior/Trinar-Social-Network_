// src/components/Profile.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaCalendarAlt,
} from "react-icons/fa";
import PostHistory from "./PostHistory";
import PostControls from "./PostControls";
import { toast } from "react-toastify";
import "./Profile.css";

function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");

  // Estados para filtros e visualização
  const [filters, setFilters] = useState({
    date: "recent",
    publishedBy: "all",
    privacy: "all",
    mentions: "all",
  });
  const [viewMode, setViewMode] = useState("list");

  // Redirecionar se o userId não estiver definido
  useEffect(() => {
    if (!userId && loggedInUserId) {
      navigate(`/profile/${loggedInUserId}`);
    }
  }, [userId, loggedInUserId, navigate]);

  // Buscar dados do perfil
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;

      try {
        const userResponse = await axios.get(`/api/users/user/${userId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);

        const followStatusResponse = await axios.get(
          `/api/users/${userId}/is-following/`,
          {
            headers: { Authorization: `Bearer ${token}` },
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

  // Buscar posts do usuário
  const fetchUserPosts = useCallback(async () => {
    if (!userId || !token) return;

    try {
      const response = await axios.get(`/api/users/${userId}/posts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Resposta da API:", response.data);

      // Transformar os posts
      const transformedPosts = response.data.map((post) => ({
        ...post,
        author: {
          id: userId,
          first_name: user?.first_name || "Nome",
          last_name: user?.last_name || "",
          profile_picture: user?.profile_picture || undefined, // Não definir um valor padrão aqui
        },
        hashtags: post.hashtags || [],
      }));

      // Ordenar os posts por data (do mais recente para o mais antigo)
      const sortedPosts = transformedPosts.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      setUserPosts(sortedPosts);
    } catch (error) {
      console.error("Erro ao carregar posts do usuário:", error);
      if (error.response) {
        console.error("Resposta do erro:", error.response.data);
        toast.error(
          `Erro: ${error.response.data.message || "Erro ao carregar posts."}`
        );
      } else {
        toast.error("Erro ao conectar com o servidor.");
      }
      setUserPosts([]);
    }
  }, [userId, token, user]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  // Função para seguir/desseguir
  const handleFollow = async () => {
    if (userId === loggedInUserId) {
      console.warn("Você não pode seguir a si mesmo.");
      return;
    }

    try {
      const response = await axios.post(
        `/api/users/${userId}/follow/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Resposta da API ao seguir:", response.data);
      setIsFollowing(true);
      toast.success("Agora você está seguindo este usuário!");
    } catch (error) {
      console.error("Erro ao seguir usuário:", error);
      toast.error("Erro ao seguir usuário. Tente novamente.");
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await axios.post(
        `/api/users/${userId}/unfollow/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Resposta da API ao desseguir:", response.data);
      setIsFollowing(false);
      toast.success("Você deixou de seguir este usuário.");
    } catch (error) {
      console.error("Erro ao deixar de seguir usuário:", error);
      toast.error("Erro ao deixar de seguir usuário. Tente novamente.");
    }
  };

  // Função para filtrar os posts
  const filteredPosts = userPosts.filter((post) => {
    if (filters.publishedBy === "user" && post.author.id !== loggedInUserId) {
      return false;
    }
    if (filters.publishedBy === "others" && post.author.id === loggedInUserId) {
      return false;
    }
    if (filters.privacy !== "all" && post.visibility !== filters.privacy) {
      return false;
    }
    if (
      filters.mentions === "mentioned" &&
      !post.text.includes(`@${user.username}`)
    ) {
      return false;
    }
    return true;
  });

  // Ordenar por data
  if (filters.date === "recent") {
    filteredPosts.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  } else {
    filteredPosts.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  }

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
          <div className="cover-overlay"></div>
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
      <hr className="profile-page-divider" />
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
          <p className="profile-page-stats">
            <strong className="number-follow">{user.following_count}</strong>{" "}
            Seguindo
          </p>
          <p className="profile-page-stats">
            <strong className="number-follow">{user.followers_count}</strong>{" "}
            Seguidores
          </p>
        </div>
      </div>
      {/* Seção de posts do usuário */}
      <div className="profile-page-posts">
        {/* Componente PostControls */}
        <div className="post-controls">
          <PostControls
            filters={filters}
            setFilters={setFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>

        {/* Renderização dos posts */}
        <div className={`posts-container ${viewMode}`}>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <div key={`${post.id}-${index}`} className="post-history">
                <PostHistory post={post} loggedInUserId={loggedInUserId} />
              </div>
            ))
          ) : (
            <p>Nenhum post encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
