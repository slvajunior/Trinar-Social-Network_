// src/components/PostHistory.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faRetweet,
  faGlobe,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "./PostHistory.css";

const PostHistory = ({ post, loggedInUserId }) => {
  console.log("Dados do post:", post); // Verifique a estrutura do post

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

  // Função para obter a foto do autor ou o fallback
  const getAuthorPhoto = () => {
    if (post.author?.profile_picture) {
      return post.author.profile_picture.startsWith("http")
        ? post.author.profile_picture
        : `http://localhost:8000${post.author.profile_picture}`;
    }
    return null; // Retorna null se não houver foto
  };

  const authorPhoto = getAuthorPhoto();

  // Função para extrair hashtags do texto, incluindo caracteres acentuados
  const extractHashtags = (text) => {
    const hashtagRegex = /#[\w\u00C0-\u00FF]+/g;
    return text.match(hashtagRegex) || [];
  };

  const hashtags = extractHashtags(post.text);

  return (
    <div className="post-history">
      <div className="author-info">
        <div className="author-photo">
          <Link to={`/profile/${post.author?.id || 0}`}>
            {authorPhoto ? (
              <img
                src={authorPhoto}
                alt="Profile"
                className="profile-photo"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "caminho/para/imagem-padrao.jpg"; // Fallback para imagem quebrada
                }}
              />
            ) : (
              <FaUserCircle className="user-photo-timeline" size={55} />
            )}
          </Link>
        </div>
        <div className="author-details">
          <div className="author-name">
            <strong>
              {post.author.first_name} {post.author?.last_name}
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
      {post.photo && (
        <img
          className="img-post"
          src={`http://localhost:8000${post.photo}`}
          alt="Post"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "caminho/para/imagem/padrao.png"; // Fallback
          }}
        />
      )}
      {post.video && (
        <video
          className="video-post"
          controls
          style={{ width: "100%", maxWidth: "675px", height: "auto" }}
        >
          <source src={`http://localhost:8000${post.video}`} type="video/mp4" />
          Seu navegador não suporta vídeo.
        </video>
      )}
      {hashtags.length > 0 && (
        <div className="post-hashtags">
          {hashtags.map((hashtag, index) => (
            <span key={index} className="hashtag">
              {hashtag}
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
};

export default PostHistory;
