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
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading, error, token, navigate]);

  // Carregar posts iniciais
  useEffect(() => {
    if (loggedInUserId && token) {
      fetchPosts();
    }
  }, [loggedInUserId, token, fetchPosts]);

  // Detectar scroll para carregar mais posts
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        fetchPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchPosts]);

  // Renderizar a foto do usuário
  // Renderizar a foto do usuário
  const renderUserPhoto = (profile_picture) => {
    if (profile_picture) {
      // Adicionar uma verificação de URL relativa aqui também
      const fullUrl = profile_picture.startsWith("http")
        ? profile_picture
        : `http://localhost:8000${profile_picture}?${Date.now()}`;
      return (
        <img
          src={fullUrl}
          alt="Profile"
          className="profile-photo"
          loading="lazy"
        />
      );
    } else {
      return <FaUserCircle className="user-photo-timeline" size={55} />;
    }
  };

  // Renderizar a mídia do post (imagem ou vídeo)
  // Renderizar a mídia do post (imagem ou vídeo)
  const renderMedia = (url, type) => {
    // Se a URL for um caminho relativo, combine-o corretamente com a URL base.
    const fullUrl = url.startsWith("http")
      ? url
      : `http://localhost:8000${url}`;

    if (type === "image") {
      return (
        <div className="media-container">
          <img className="img-post" src={fullUrl} alt="Post" loading="lazy" />
        </div>
      );
    } else if (type === "video") {
      return (
        <div className="media-container">
          <video className="video-post" controls loading="lazy">
            <source src={fullUrl} type="video/mp4" />
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </div>
      );
    }
  };

  // Função para formatar a data
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
    <div>
      {posts.map((post, index) => {
        // Usando post.id e post.author?.id como parte da chave única
        const uniqueKey = `${post.id}-${post.author?.id}-${index}`;

        return (
          <div key={uniqueKey} className="post">
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
                </div>
                <div className="post-time-container">
                  <p className="post-time" title={getFullDate(post.created_at)}>
                    {formatDate(post.created_at)}
                  </p>
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
            {post.photo_url && renderMedia(post.photo_url, "image")}
            {post.video_url && renderMedia(post.video_url, "video")}
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="post-hashtags">
                {post.hashtags.map((hashtag, index) => (
                  <span key={`${hashtag}-${index}`} className="hashtag">
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
      })}
    </div>
  );
}

export default Timeline;
