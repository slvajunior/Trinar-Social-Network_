// src/components/NavBar.js

import React from "react";
import { FaUserCircle } from "react-icons/fa"; // Importe o ícone correto
import "./NavBar.css";

const NavBar = () => {
  return (
    <div className="navbar">
      <h1 className="navbar-logo">trinar</h1>
      <div className="navbar-extra">
        <input
          type="text"
          className="search-input"
          placeholder="Pesquisar..."
        />
        <div className="user-photo-nav">
          <FaUserCircle size={45} />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
