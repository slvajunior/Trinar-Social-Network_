// src/components/NavBar.js
import React, { useState } from "react";
import { FaUserCircle, FaSearch } from "react-icons/fa"; // Importe os ícones
import "./NavBar.css";

const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowResults(e.target.value.length > 0); // Mostrar resultados se houver texto
  };

  return (
    <div className="navbar">
      <h1 className="logo">trinar</h1>
      <div className="navbar-extra">
        <div className="search-container">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" /> {/* Ícone de lupa */}
            <input
              type="text"
              className="search-input"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          {/* Div de Resultados */}
          {showResults && (
            <div className="search-results">
              <p>Resultados para: "{searchQuery}"</p>
              {/* Aqui você pode mapear os resultados quando o backend estiver pronto */}
            </div>
          )}
        </div>
        <div className="user-photo-nav">
          <FaUserCircle size={45} /> {/* Ícone do usuário */}
        </div>
      </div>
    </div>
  );
};

export default NavBar;