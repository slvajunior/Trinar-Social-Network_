// src/components/PostField.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faVideo, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FaUserCircle } from "react-icons/fa"; // Importação do ícone
import "./PostField.css";

const PostField = () => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const mediaFiles = files.map((file) => URL.createObjectURL(file));
    setMedia((prev) => [...prev, ...mediaFiles]);
  };

  const removeMedia = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePost = () => {
    // Lógica para postar o conteúdo
    console.log("Postando:", { content, media });
    alert("Post criado com sucesso!");
    setContent("");
    setMedia([]);
    setIsModalOpen(false); // Fechar o modal após postar
  };

  return (
    <div className="post-field-container">
      {/* Foto do Usuário e Campo de Texto */}
      <div className="user-input-container">
        <div className="user-photo">
          <FaUserCircle size={45} color="#6200ee" /> {/* Ícone do usuário */}
        </div>
        <textarea
          className="post-input"
          placeholder="O que você quer compartilhar?"
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
          <FontAwesomeIcon icon={faImage} />
          <span>Imagem</span>
        </label>
        <label htmlFor="video-upload" className="media-upload-button">
          <FontAwesomeIcon icon={faVideo} />
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
              <button onClick={() => removeMedia(index)} className="remove-media">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal para Texto */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <textarea
              className="modal-textarea"
              placeholder="O que você quer compartilhar?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
              autoFocus
            ></textarea>
            <div className="modal-actions">
              <button onClick={() => setIsModalOpen(false)} className="cancel-button">
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