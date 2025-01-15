// src/components/Sidebar.js
import React from "react";
import { FaHome, FaBell, FaEnvelope, FaUser, FaCog, FaShieldAlt } from "react-icons/fa"; // Importando ícones
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-links">
        <li><FaHome /> Home Page</li>
        <li><FaBell /> Notifications</li>
        <li><FaEnvelope /> Messages</li>
        <li><FaUser /> Profile</li>
        <li><FaCog /> Settings</li>
        <li><FaShieldAlt /> Privacy</li>
      </ul>
    </div>
  );
};

export default Sidebar;
