import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faList,
  faThLarge,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./PostControls.css"; // Arquivo de estilos

const PostControls = ({
  filters,
  setFilters,
  viewMode,
  setViewMode,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="post-controls">
      {/* Botão de Filtro */}
      <button
        className="filter-button"
        onClick={() => setIsModalOpen(true)}
      >
        <FontAwesomeIcon icon={faFilter} /> Filtrar
      </button>

      {/* Modal de Filtros */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setIsModalOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h3>Filtrar Posts</h3>
            <div className="filter-group">
              <label>Ordenar por data:</label>
              <select
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              >
                <option value="recent">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Publicado por:</label>
              <select
                name="publishedBy"
                value={filters.publishedBy}
                onChange={handleFilterChange}
              >
                <option value="all">Todos</option>
                <option value="user">Publicados por mim</option>
                <option value="others">Publicados por outros</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Privacidade:</label>
              <select
                name="privacy"
                value={filters.privacy}
                onChange={handleFilterChange}
              >
                <option value="all">Todos</option>
                <option value="public">Público</option>
                <option value="friends">Amigos</option>
                <option value="onlyMe">Somente eu</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Menções:</label>
              <select
                name="mentions"
                value={filters.mentions}
                onChange={handleFilterChange}
              >
                <option value="all">Todos os posts</option>
                <option value="mentioned">Posts que me mencionam</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Abas de Visualização */}
      <div className="view-mode-tabs">
        <button
          className={`view-mode-button ${viewMode === "list" ? "active" : ""}`}
          onClick={() => setViewMode("list")}
        >
          <FontAwesomeIcon icon={faList} /> Lista
        </button>
        <button
          className={`view-mode-button ${viewMode === "grid" ? "active" : ""}`}
          onClick={() => setViewMode("grid")}
        >
          <FontAwesomeIcon icon={faThLarge} /> Grade
        </button>
      </div>
    </div>
  );
};

export default PostControls;