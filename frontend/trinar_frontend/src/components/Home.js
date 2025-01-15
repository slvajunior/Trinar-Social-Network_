// src/components/Home.js
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import NavBar from "./NavBar";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <NavBar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <div style={{ marginLeft: isSidebarOpen ? '0' : '260px', padding: '20px', marginTop: '80px' }}>
        <h1>Bem-vindo ao Trinar!</h1>
        <p>Conteúdo da Home</p>
      </div>
    </div>
  );
};

export default Home;
