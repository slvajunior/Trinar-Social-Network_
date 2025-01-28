// src/components/Post.jsx

import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faRetweet,
  faGlobe,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
// import "./Post.css";

const Post = ({ post, followingStatus, handleFollow, loggedInUserId }) => {
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
    <div className="post">
      <div className="author-info">
        <div className="author-photo">
          <Link to={`/profile/${post.author?.id}`}>
            {post.author?.profile_picture ? (
              <img
                src={post.author.profile_picture}
                alt="Profile"
                className="profile-photo"
                onError={(e) => {
                  e.target.onerror = null; // Evita loops de erro
                  e.target.src = "caminho/para/imagem/padrao.png"; // Fallback
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
              {post.author?.first_name} {post.author?.last_name}
            </strong>
            {/* Verifica se o autor não é o usuário logado e se não está sendo seguido */}
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
          onError={(e) => {
            e.target.onerror = null; // Evita loops de erro
            e.target.src = "caminho/para/imagem/padrao.png"; // Fallback
          }}
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
};

export default Post;
