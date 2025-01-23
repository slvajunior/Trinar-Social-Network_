import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faVideo, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PostField.css";

const PostField = () => {
    const [content, setContent] = useState("");
    const [media, setMedia] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState({ profile_picture: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPosting, setIsPosting] = useState(false);
    const navigate = useNavigate();

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
        const validFiles = files.filter((file) => {
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
            const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "video/mp4"];
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                alert(`Tipo de arquivo não suportado: ${file.name}`);
                return false;
            }
            if (file.size > MAX_FILE_SIZE) {
                alert(`Arquivo muito grande: ${file.name} (máximo: 5MB)`);
                return false;
            }
            return true;
        });
        setMedia((prev) => [...prev, ...validFiles]);
    };

    const removeMedia = (index) => {
        setMedia((prev) => prev.filter((_, i) => i !== index));
    };

    const handlePost = async () => {
        if (content.trim() === "") {
            alert("Por favor, adicione um texto ao seu post!");
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
            formData.append("text", content);
            formData.append("visibility", "public");
            media.forEach((file) => {
                formData.append("media", file);
            });

            const response = await axios.post("http://localhost:8000/api/posts/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 201) {
                alert("Post criado com sucesso!");
                setContent("");
                setMedia([]);
                setIsModalOpen(false);
                window.location.reload();
            }
        } catch (error) {
            console.error("Erro ao criar o post:", error);
            alert("Erro ao criar o post. Tente novamente.");
        } finally {
            setIsPosting(false);
        }
    };

    const handleClickOutside = (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            setIsModalOpen(false);
        }
    };

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
                    onFocus={() => setIsModalOpen(true)}
                    readOnly
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
                            <img src={URL.createObjectURL(file)} alt={`Mídia ${index}`} />
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
                        <div className="char-count">{content.length}/500</div>
                        <div className="modal-actions">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="cancel-button"
                            >
                                Cancelar
                            </button>
                            <button onClick={handlePost} className="post-button" disabled={isPosting}>
                                {isPosting ? "Postando..." : "Postar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostField;