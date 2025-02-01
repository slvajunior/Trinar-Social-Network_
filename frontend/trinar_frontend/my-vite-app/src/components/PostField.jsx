// src/components/PostField.jsx

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faVideo, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import "./PostField.css";

const PostField = () => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [user, setUser] = useState({ profile_picture: "", id: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const navigate = useNavigate();

  // Busca os dados do usuário autenticado
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Nenhum token encontrado.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/api/auth/user/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      setError("Erro ao buscar os dados do usuário.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Lida com o upload de mídia (fotos e vídeos)
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
      const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "video/mp4"];
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        alert(`Tipo de arquivo não suportado: ${file.name}`);
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`Arquivo muito grande: ${file.name} (máximo: 20MB)`);
        return false;
      }
      return true;
    });
    setMedia((prev) => [...prev, ...validFiles]);
  };

  // Remove uma mídia da lista de pré-visualização
  const removeMedia = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  // Lida com a criação do post
  const handlePost = async () => {
    if (content.trim() === "" && media.length === 0) {
      alert("Por favor, adicione um texto ou uma mídia ao seu post!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuário não autenticado. Faça login novamente.");
      return;
    }

    setIsPosting(true);
    try {
      const formData = new FormData();
      formData.append("text", content.trim() || "Nova postagem com mídia");
      formData.append("visibility", "public");

      // Adiciona cada arquivo de mídia ao FormData
      media.forEach((file, index) => {
        if (file.type.startsWith("image")) {
          formData.append("photo", file);
        } else if (file.type.startsWith("video")) {
          formData.append("video", file);
        }
      });

      const response = await axios.post(
        "http://localhost:8000/api/posts/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Post criado com sucesso!");
        setContent("");
        setMedia([]);
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao criar o post:", error);
      alert("Erro ao criar o post. Tente novamente.");
    } finally {
      setIsPosting(false);
    }
  };

  // Redireciona para o perfil do usuário ao clicar na foto
  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="post-field-container">
      {/* Foto do Usuário e Campo de Texto */}
      <div className="user-input-container">
        <div
          className="user-photo"
          onClick={handleProfileClick}
          style={{ cursor: "pointer" }}
        >
          {user.profile_picture ? (
            <img
              src={`http://localhost:8000${user.profile_picture}`}
              alt="Profile"
              className="profile-photo-postfield"
            />
          ) : (
            <FaUserCircle className="user-photo" size={55} />
          )}
        </div>
        <textarea
          className="post-input"
          placeholder="What is happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
        ></textarea>
      </div>

      {/* Contador de Caracteres */}
      <div className="char-count">{content.length}/500</div>

      {/* Divisor */}
      <hr className="divider" />

      {/* Botões de Upload e Postar */}
      <div className="media-upload-container">
        <label htmlFor="image-upload" className="media-upload-button">
          <FontAwesomeIcon className="icon-img" icon={faImage} style={{color: "var(--green-color)"}} />
          <span>Imagem</span>
        </label>
        <label htmlFor="video-upload" className="media-upload-button">
          <FontAwesomeIcon className="media-icon-video" icon={faVideo} style={{color: "var(--red-color)"}} />
          <span>Vídeo</span>
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleMediaUpload}
          style={{ display: "none" }}
        />
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          multiple
          onChange={handleMediaUpload}
          style={{ display: "none" }}
        />

        {/* Botão "Postar" */}
        {(content.trim() !== "" || media.length > 0) && (
          <button
            onClick={handlePost}
            className="post-button"
            disabled={isPosting}
          >
            {isPosting ? (
              "Postando..."
            ) : (
              <>
                <FaPaperPlane className="post-icon" style={{color: "var(--color-blue)"}}/>
                <span style={{padding: "10px"}}>Postar</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Pré-visualização de Mídia */}
      {media.length > 0 && (
        <div className="media-preview">
          {media.slice(0, 6).map((file, index) => (
            <div key={index} className="media-item">
              {file.type.startsWith("image") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Mídia ${index}`}
                  className="media-preview-item"
                />
              ) : (
                <video controls className="media-preview-item">
                  <source src={URL.createObjectURL(file)} type={file.type} />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              )}
              <button
                onClick={() => removeMedia(index)}
                className="remove-media"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostField;