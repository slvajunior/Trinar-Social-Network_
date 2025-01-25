import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faRetweet, faGlobe, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Timeline.css";

function Timeline() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [followingStatus, setFollowingStatus] = useState({});
  const navigate = useNavigate();

  // Verifica se o usuário está logado
  const loggedInUserId = localStorage.getItem("userId");

  // Se o usuário não estiver logado, redirecione para a página de login
  useEffect(() => {
    if (!loggedInUserId) {
      navigate("/login");
    }
  }, [loggedInUserId, navigate]);

  // Função para buscar os posts da timeline
  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/timeline/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Não foi possível carregar os posts");
      }
      const data = await response.json();
      setPosts(data);

      // Verificar quem o usuário logado já segue
      const followStatuses = await Promise.all(
        data.map((post) =>
          axios
            .get(`/api/users/${post.author.id}/is-following/`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => ({ userId: post.author.id, isFollowing: res.data.is_following }))
            .catch(() => ({ userId: post.author.id, isFollowing: false }))
        )
      );

      // Mapear o status de seguindo para cada usuário
      const statusMap = followStatuses.reduce((acc, item) => {
        acc[item.userId] = item.isFollowing;
        return acc;
      }, {});

      setFollowingStatus(statusMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para seguir um usuário
  const handleFollow = async (userId) => {
    try {
      const response = await axios.post(
        `/api/users/${userId}/follow/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setFollowingStatus((prevState) => ({ ...prevState, [userId]: true }));
      }
    } catch (err) {
      console.error("Erro ao seguir usuário:", err);
      alert("Erro ao seguir usuário. Verifique o console para mais detalhes.");
    }
  };

  // Buscar os posts ao carregar o componente
  useEffect(() => {
    if (loggedInUserId) {
      fetchPosts();
    }
  }, [loggedInUserId]);

  // Função para renderizar a foto do usuário
  const renderUserPhoto = (profile_picture) => {
    if (profile_picture) {
      return <img src={`http://localhost:8000${profile_picture}`} alt="Profile" className="profile-photo" />;
    } else {
      return <FaUserCircle className="user-photo-timeline" size={55} />;
    }
  };

  // Função para formatar a data do post
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now - date;
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}min`;
    } else if (diffInHours < 24) {
      return `Há ${diffInHours}h`;
    } else {
      return date.toLocaleString("pt-BR", {
        day: "numeric",
        month: "short",
      });
    }
  };

  // Função para exibir a data completa no tooltip
  const getFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  };

  return (
    <div className="timeline">
      {isLoading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          {posts.length > 0 ? (
            posts.map((post) => {
              const isFollowing = followingStatus[post.author.id];
              const isCurrentUser = post.author.id.toString() === loggedInUserId;

              return (
                <div key={post.id} className="post">
                  <div className="author-info">
                    <div className="author-photo">
                      <Link to={`/profile/${post.author?.id}`}>
                        {renderUserPhoto(post.author?.profile_picture)}
                      </Link>
                    </div>
                    <div className="author-details">
                      <div className="author-name">
                        <strong>
                          {post.author?.first_name} {post.author?.last_name} 
                        </strong>
                        {/* Exibe o texto "Seguir" apenas se o usuário não estiver sendo seguido e não for o próprio usuário */}
                        {!isCurrentUser && !isFollowing && (
                          <span
                            className="follow-text"
                            onClick={() => handleFollow(post.author.id)}
                          >
                           · Seguir
                          </span>
                        )}
                      </div>
                      <div className="post-time-container">
                        <p className="post-time" title={getFullDate(post.created_at)}>
                          {formatDate(post.created_at)}
                        </p>
                        {/* Ícone de visibilidade ao lado do tempo do post */}
                        {post.visibility === "public" ? (
                          <FontAwesomeIcon icon={faGlobe} className="visibility-icon" title="Público" />
                        ) : (
                          <FontAwesomeIcon icon={faUsers} className="visibility-icon" title="Somente seguidores" />
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-post">{post.text}</p>

                  {/* Renderização de Mídia */}
                  {post.photo_url && (
                    <div className="media-container">
                      <img
                        className="img-post"
                        src={`http://localhost:8000${post.photo_url}`}
                        alt="Post"
                      />
                    </div>
                  )}
                  {post.video_url && (
                    <div className="media-container">
                      <video className="video-post" controls>
                        <source src={`http://localhost:8000${post.video_url}`} type="video/mp4" />
                        Seu navegador não suporta o elemento de vídeo.
                      </video>
                    </div>
                  )}

                  {/* Exibir as hashtags do post */}
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="post-hashtags">
                      {post.hashtags.map((hashtag, index) => (
                        <span key={index} className="hashtag">
                          #{hashtag}
                        </span>
                      ))}
                    </div>
                  )}

                  <hr className="divider-post" />
                  <div className="post-actions">
                    <button className="action-button">
                      <FontAwesomeIcon icon={faHeart} size="lg" /> Curtir
                    </button>
                    <button className="action-button">
                      <FontAwesomeIcon icon={faComment} size="lg" /> Comentar
                    </button>
                    <button className="action-button">
                      <FontAwesomeIcon icon={faRetweet} size="lg" /> Repostar
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Sem posts para exibir.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Timeline;