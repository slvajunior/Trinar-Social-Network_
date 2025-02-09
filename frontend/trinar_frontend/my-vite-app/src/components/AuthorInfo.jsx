// src/components/AuthorInfo.jsx
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import 'line-awesome/dist/line-awesome/css/line-awesome.min.css';
import "./AuthorInfo.css";

const AuthorInfo = ({ author = {}, followingStatus = {}, handleFollow, loggedInUserId, post }) => {
  console.log("👤 Autor recebido:", author);  // 🔍 LOG PARA DEBUG

  if (!post) {
    return <p>Erro: Postagem não encontrada.</p>;
  }

  // Função para formatar a data do post
  const formatDate = (dateString) => {
    if (!dateString) return "Data inválida";
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
    if (!dateString) return "Data inválida";
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

  // Verificar se a foto do autor existe e é válida
  const getAuthorPhoto = () => {
    if (author?.profile_picture) {
      // Verifica se é uma URL absoluta ou relativa
      return author.profile_picture.startsWith('http') ? author.profile_picture : `http://localhost:8000${author.profile_picture}`;
    }
    return "caminho/para/imagem/padrao.png"; // Caminho de imagem padrão
  };

  return (
    <div className="author-info">
      <div className="author-photo">
        <Link to={`/profile/${author?.id || 0}`}>
          {author?.profile_picture ? (
            <img
              src={getAuthorPhoto()}  // Usa a função para garantir a URL correta
              alt="Profile"
              className="profile-photo"
            />
          ) : (
            <FaUserCircle className="user-photo-timeline" size={55} />
          )}
        </Link>
      </div>
      <div className="author-details">
        <div className="author-name">
          <strong>
            {author?.first_name || "Nome Desconhecido"} {author?.last_name || ""}
          </strong>
          {author?.id !== parseInt(loggedInUserId) &&
            !followingStatus[author?.id] && (
              <span
                className="follow-text"
                onClick={() => handleFollow && handleFollow(author?.id)}
              >
               {"·"} Seguir
              </span>
            )}
        </div>
        <div className="post-time-container">
          <p className="post-time" title={getFullDate(post.created_at)}>
            {formatDate(post.created_at)} 
          </p>
          {post.visibility === "public" ? (
            <i className="las la-globe visibility-icon" title="Público" style={{ fontSize: '16px', width: '16px', height: '16px', margin: '0 0 2px'}}></i>
          ) : (
            <FontAwesomeIcon icon={faUsers} className="visibility-icon" title="Somente seguidores" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorInfo;