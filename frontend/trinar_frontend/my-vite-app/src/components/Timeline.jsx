import React, { useEffect, useState, useCallback } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faRetweet,
  faGlobe,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Timeline.css";

function Timeline() {
  const [posts, setPosts] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");

  // Verifica se o usuário está logado
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Buscar os posts da timeline
  const fetchPosts = useCallback(async () => {
    if (!hasMore || isLoading || error || !token) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/timeline/?page=${page}&page_size=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      if (data && Array.isArray(data.results) && data.results.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...data.results]);

        // Verificar status de "seguindo" para cada usuário no lote de posts
        const followStatuses = await Promise.all(
          data.results.map((post) =>
            axios
              .get(`/api/users/${post.author.id}/is-following/`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              .then((res) => ({
                userId: post.author.id,
                isFollowing: res.data.is_following,
              }))
              .catch(() => ({ userId: post.author.id, isFollowing: false }))
          )
        );

        // Atualizar o estado com os status de "seguindo"
        const statusMap = followStatuses.reduce((acc, item) => {
          acc[item.userId] = item.isFollowing;
          return acc;
        }, {});
        setFollowingStatus((prevState) => ({ ...prevState, ...statusMap }));

        setHasMore(data.next !== null);
        if (data.next) {
          setPage((prevPage) => prevPage + 1);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err.message);
      console.error("Erro ao carregar posts:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading, error, token]);

  // Carregar posts iniciais
  useEffect(() => {
    if (loggedInUserId && token) {
      fetchPosts();
    }
  }, [loggedInUserId, token, fetchPosts]);

  // Função para seguir um usuário
  const handleFollow = async (userId) => {
    if (userId === loggedInUserId) {
      console.warn("Você não pode seguir a si mesmo.");
      return; // Se for o mesmo usuário, nada acontece
    }
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

  // Função para formatar a data do post
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now - date;
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

    if (diffInMinutes < 60) {
      return `Há ${diffInMinutes}min`;
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
    <div>
      {posts.map((post, index) => {
        const uniqueKey = `${post.id}-${post.author?.id}-${index}`;

        return (
          <div key={uniqueKey} className="post">
            <div className="author-info">
              <div className="author-photo">
                <Link to={`/profile/${post.author?.id}`}>
                  {post.author?.profile_picture ? (
                    <img
                      src={post.author.profile_picture}
                      alt="Profile"
                      className="profile-photo"
                      loading="lazy"
                    />
                  ) : (
                    <FaUserCircle className="user-photo-timeline" size={55} />
                  )}
                </Link>
              </div>
              <div className="author-details">
                <div className="author-name">
                  <strong>
                    {post.author?.first_name} {post.author?.last_name}
                  </strong>
                  {/* Verifica se o autor não é o usuário logado antes de renderizar o botão "Seguir" */}
                  {post.author?.id !== parseInt(loggedInUserId) &&
                    !followingStatus[post.author?.id] && (
                      <span
                        className="follow-text"
                        onClick={() => handleFollow(post.author?.id)}
                      >
                        Seguir
                      </span>
                    )}
                </div>

                <div className="post-time-container">
                  <p className="post-time" title={getFullDate(post.created_at)}>
                    {formatDate(post.created_at)}
                  </p>
                  {/* Ícone de visibilidade ao lado do tempo do post */}
                  {post.visibility === "public" ? (
                    <FontAwesomeIcon
                      icon={faGlobe}
                      className="visibility-icon"
                      title="Público"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faUsers}
                      className="visibility-icon"
                      title="Somente seguidores"
                    />
                  )}
                </div>
              </div>
            </div>
            <p className="text-post">{post.text}</p>
            {post.photo_url && (
              <img
                className="img-post"
                src={post.photo_url}
                alt="Post"
                loading="lazy"
              />
            )}
            {post.video_url && (
              <video className="video-post" controls loading="lazy">
                <source src={post.video_url} type="video/mp4" />
                Seu navegador não suporta vídeo.
              </video>
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
                <FontAwesomeIcon icon={faHeart} /> Curtir
              </button>
              <button className="action-button">
                <FontAwesomeIcon icon={faComment} /> Comentar
              </button>
              <button className="action-button">
                <FontAwesomeIcon icon={faRetweet} /> Repostar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Timeline;
