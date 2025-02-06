// src/components/Post.jsx
import React, { useState, useRef, useEffect } from "react";
import AuthorInfo from "./AuthorInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faRetweet } from "@fortawesome/free-solid-svg-icons";
import "./Post.css";

const Post = ({ post, followingStatus, handleFollow, loggedInUserId }) => {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);

  const maxLength = 100; // Defina o número máximo de caracteres

  // Função para calcular o comprimento do texto com quebras de linha
  const calculateTextLength = (text) => {
    const lines = text.split("\n");
    let totalChars = 0;

    lines.forEach((line, index) => {
      totalChars += line.length;
      if (index < lines.length - 1) {
        totalChars += 58; // Adiciona 58 caracteres para cada quebra de linha
      }
    });

    return totalChars;
  };

  // Verifica se o texto deve ser truncado
  useEffect(() => {
    if (textRef.current) {
      const totalChars = calculateTextLength(post.text);
      setIsTruncated(totalChars > maxLength);
    }
  }, [post.text]);

  // Texto truncado
  const truncateText = (text, maxLength) => {
    const lines = text.split("\n");
    let totalChars = 0;
    let truncatedText = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineLength = line.length;

      if (totalChars + lineLength + (i < lines.length - 1 ? 58 : 0) > maxLength) {
        // Adiciona parte da linha até atingir o limite
        const remainingChars = maxLength - totalChars;
        truncatedText += line.slice(0, remainingChars) + "...";
        break;
      } else {
        // Adiciona a linha completa
        truncatedText += line;
        totalChars += lineLength;

        // Adiciona 58 caracteres para a quebra de linha (exceto na última linha)
        if (i < lines.length - 1) {
          truncatedText += "\n";
          totalChars += 58;
        }
      }
    }

    return truncatedText;
  };

  return (
    <div className="post-tl">
      <AuthorInfo
        author={post.author}
        followingStatus={followingStatus}
        handleFollow={handleFollow}
        loggedInUserId={loggedInUserId}
        post={post}
      />

      <p ref={textRef} className={`text-post ${expanded ? "" : ""}`}>
        {expanded ? post.text : truncateText(post.text, maxLength)}
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

      {post.photo_url && (
        <img
          className="img-post"
          src={post.photo_url}
          alt="Post"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "caminho/para/imagem/padrao.png";
          }}
        />
      )}
      {post.video_url && (
        <video className="video-post" controls loading="lazy">
          <source src={post.video_url} type="video/mp4" />
          Seu navegador não suporta vídeo.
        </video>
      )}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="post-hashtags">
          {post.hashtags.map((hashtag, index) => (
            <span key={index} className="hashtag">
              #{hashtag}
            </span>
          ))}
        </div>
      )}
      <hr className="divider-post-tl" />
      <div className="post-actions-tl">
        <button className="action-button-tl">
          <FontAwesomeIcon icon={faHeart} /> Curtir
        </button>
        <button className="action-button-tl">
          <FontAwesomeIcon icon={faComment} /> Comentar
        </button>
        <button className="action-button-tl">
          <FontAwesomeIcon icon={faRetweet} /> Repostar
        </button>
      </div>
    </div>
  );
};

export default Post;