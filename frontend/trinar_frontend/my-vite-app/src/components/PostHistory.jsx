// src/components/PostHistory.jsx
import React, { useState, useRef, useEffect } from "react";
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
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
      if (textRef.current) {
        const lineHeight = parseInt(getComputedStyle(textRef.current).lineHeight, 10);
        const maxLines = 2;
        const maxHeight = lineHeight * maxLines;
  
        setIsTruncated(textRef.current.scrollHeight > maxHeight);
      }
    }, [post.text]); // Executa quando o texto muda
  
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

  const getAuthorPhoto = () => {
    if (post.author?.profile_picture) {
      return post.author.profile_picture.startsWith("http")
        ? post.author.profile_picture
        : `http://localhost:8000${post.author.profile_picture}`;
    }
    return null;
  };

  const authorPhoto = getAuthorPhoto();

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
                  e.target.src = "caminho/para/imagem-padrao.jpg";
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
      <p ref={textRef} className={`text-post ${expanded ? "expanded" : ""}`}>
        {post.text}
      </p>
      {isTruncated && !expanded && (
        <span className="read-more" onClick={() => setExpanded(true)}>
          Ler mais
        </span>
      )}
      {expanded && (
        <span className="read-more" onClick={() => setExpanded(false)}>
          Mostrar menos
        </span>
      )}
      {post.photo && (
        <img
          className="img-post"
          src={`http://localhost:8000${post.photo}`}
          alt="Post"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "caminho/para/imagem/padrao.png";
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
      <hr className="divider-post-history" />
      <div className="post-actions">
        <button className="action-button">
          <FontAwesomeIcon className="curtir" icon={faHeart} /> Curtir
        </button>
        <button className="action-button">
          <FontAwesomeIcon className="comentar" icon={faComment} /> Comentar
        </button>
        <button className="action-button">
          <FontAwesomeIcon className="repostar" icon={faRetweet} /> Repostar
        </button>
      </div>
    </div>
  );
};

export default PostHistory;
