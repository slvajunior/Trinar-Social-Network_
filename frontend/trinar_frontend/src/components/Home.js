// src/components/Home.js
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Bem-vindo ao Trinar!</h1>
      <nav>
        <Link to="/register">Registrar</Link> | <Link to="/login">Entrar</Link> |{" "}
        <Link to="/logout">Sair</Link>
      </nav>
    </div>
  );
};

export default Home;