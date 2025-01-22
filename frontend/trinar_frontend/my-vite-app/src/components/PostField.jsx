import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faVideo, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FaUserCircle } from "react-icons/fa"; // Importação do ícone
import axios from "axios"; // Usando axios para buscar dados do usuário
import { useNavigate } from "react-router-dom"; // Importando useNavigate
import "./PostField.css";

const PostField = () => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState({ profile_picture: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para navegação

  // Função para buscar os dados do usuário
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

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const mediaFiles = files.map((file) => URL.createObjectURL(file));
    setMedia((prev) => [...prev, ...mediaFiles]);
  };

  const removeMedia = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = () => {
    if (content.trim() === "") {
      alert("Por favor, adicione um texto ao seu post!");
      return;
    }

    // Lógica para postar o conteúdo
    console.log("Postando:", { content, media });
    alert("Post criado com sucesso!");
    setContent("");
    setMedia([]);
    setIsModalOpen(false); // Fechar o modal após postar
  };

  const handleClickOutside = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setIsModalOpen(false); // Fecha o modal quando clica fora dele
    }
  };

  // Função para redirecionar ao clicar na foto de perfil
  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="post-field-container">
      {/* Foto do Usuário e Campo de Texto */}
      <div className="user-input-container">
        <div className="user-photo" onClick={handleProfileClick} style={{ cursor: "pointer" }}>
          {user.profile_picture ? (
            <img
              src={`http://localhost:8000${user.profile_picture}`}
              alt="Profile"
              className="profile-photo"
            />
          ) : (
            <FaUserCircle className="user-photo" size={55} />
          )}
        </div>
        <textarea
          className="post-input"
          placeholder="What is happening?"
          value={content}
          onFocus={() => setIsModalOpen(true)} // Abrir modal ao focar
          readOnly // Impede a digitação direta no textarea
        ></textarea>
      </div>

      {/* Contador de Caracteres */}
      <div className="char-count">{content.length}/500</div>

      {/* Divisor */}
      <hr className="divider" />

      {/* Botões de Upload */}
      <div className="media-upload-container">
        <label htmlFor="image-upload" className="media-upload-button">
          <FontAwesomeIcon className="media-icon-img" icon={faImage} />
          <span>Imagem</span>
        </label>
        <label htmlFor="video-upload" className="media-upload-button">
          <FontAwesomeIcon className="media-icon-video" icon={faVideo} />
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
      </div>

      {/* Pré-visualização de Mídia */}
      {media.length > 0 && (
        <div className="media-preview">
          {media.map((file, index) => (
            <div key={index} className="media-item">
              <img src={file} alt={`Mídia ${index}`} />
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

      {/* Modal para Texto */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleClickOutside}>
          <div className="modal-content">
            <textarea
              className="modal-textarea"
              placeholder="O que você quer compartilhar?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
              autoFocus
            ></textarea>
            {/* Contador de Caracteres no Modal */}
            <div className="char-count">{content.length}/500</div>
            <div className="modal-actions">
              <button
                onClick={() => setIsModalOpen(false)}
                className="cancel-button"
              >
                Cancelar
              </button>
              <button onClick={handlePost} className="post-button">
                Postar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostField;