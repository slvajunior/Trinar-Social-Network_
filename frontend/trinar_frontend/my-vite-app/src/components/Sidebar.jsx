import React from "react";
import { FaHome, FaBell, FaEnvelope, FaUser, FaCog, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Importando useNavigate
import "./Sidebar.css";

const Sidebar = () => {
    const navigate = useNavigate(); // Hook para navegação

    return (
        <div className="sidebar">
            <ul className="sidebar-links">
                <li onClick={() => navigate("/")}><FaHome /> Home Page</li>
                <li onClick={() => navigate("/notifications")}><FaBell /> Notifications</li>
                <li onClick={() => navigate("/messages")}><FaEnvelope /> Messages</li>
                <li onClick={() => navigate("/profile")}><FaUser /> Profile</li> {/* Redireciona para /profile */}
                <li onClick={() => navigate("/settings")}><FaCog /> Settings</li>
                <li onClick={() => navigate("/privacy")}><FaShieldAlt /> Privacy</li>
                <hr className="divider" />
            </ul>
        </div>
    );
};

export default Sidebar;