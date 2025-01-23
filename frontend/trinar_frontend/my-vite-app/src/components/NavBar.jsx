import React, { useState, useEffect, useRef } from "react";
import {
  FaUserCircle,
  FaSearch,
  FaCog,
  FaQuestionCircle,
  FaSun,
  FaMoon,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    profile_picture: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const modalRef = useRef(null);
  const userIconRef = useRef(null);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Nenhum token foi encontrado. Faça login novamente.");
        setIsLoading(false);
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:8000/api/auth/user/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        setError("Token inválido. Redirecionando para login...");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(`Erro ao buscar dados do usuário: ${errorData.detail}`);
      }
    } catch {
      setError("Erro ao conectar ao servidor. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Nenhum token foi encontrado. Faça login novamente.");
      navigate("/login");
    } else {
      fetchUserData();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleClickOutside = (event) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(event.target) &&
      !userIconRef.current.contains(event.target)
    ) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoClick = () => {
    window.location.href = "http://localhost:5173/";
  };

  return (
    <div className="navbar">
      <h1 className="logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
        trinar
      </h1>
      <div className="navbar-extra">
        <div className="search-container">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(e.target.value.trim() !== "");
              }}
            />
          </div>
          {showResults && (
            <div className="search-results">
              <p>Resultados para: "{searchQuery}"</p>
            </div>
          )}
        </div>

        <div
          className="user-photo-nav"
          onClick={() => setIsModalOpen(!isModalOpen)}
          ref={userIconRef}
        >
          <div className="photo-container">
            {user.profile_picture ? (
              <img
                src={`http://localhost:8000${user.profile_picture}`}
                alt="Profile"
                className="profile-photo-nav"
              />
            ) : (
              <FaUserCircle className="user-photo" size={55} />
            )}
          </div>
        </div>
      </div>

      <div
        className={`user-modal ${isModalOpen ? "modal-open" : "modal-close"}`}
        ref={modalRef}
      >
        <div className="user-profile">
          <div className="profile-header">
            {user.profile_picture ? (
              <img
                src={`http://localhost:8000${user.profile_picture}`}
                alt="Profile"
                className="profile-photo"
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer" }}
              />
            ) : (
              <FaUserCircle
                className="user-photo"
                size={45}
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer" }}
              />
            )}
            <div className="profile-name">
              {isLoading ? (
                <p>Carregando...</p>
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : (
                <p>
                  {user.first_name} {user.last_name}
                </p>
              )}
            </div>
          </div>
          <hr className="modal-divider" />
          <button
            className="edit-profile-btn"
            onClick={() => navigate("/profile/edit")}
          >
            Editar perfil
          </button>
        </div>

        <div className="user-modal-item">
          <div className="icon-circle">
            <FaCog size={25} />
          </div>
          <span>Configurações e privacidade</span>
        </div>
        <div className="user-modal-item">
          <div className="icon-circle">
            <FaQuestionCircle size={25} />
          </div>
          <span>Ajuda e Suporte</span>
        </div>
        <div className="user-modal-item">
          <div className="icon-circle">
            <FaMoon size={25} />
          </div>
          <span>Modo Escuro</span>
        </div>
        <div className="user-modal-item">
          <div className="icon-circle">
            <FaSun size={25} />
          </div>
          <span>Modo Claro</span>
        </div>
        <div className="user-modal-item" onClick={handleLogout}>
          <div className="icon-circle">
            <FaSignOutAlt size={25} />
          </div>
          <span>Sair</span>
        </div>
        <footer className="modal-footer">
          <p>© 2025 Trinar. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default NavBar;