import React from "react";
import { useLocation } from "react-router-dom"; // Importe useLocation
import NavBar from "./NavBar"; // Importe o componente da NavBar
import "./Layout.css"; // Importe o arquivo de estilos

const Layout = ({ children }) => {
  const location = useLocation(); // Obtém a rota atual

  // Lista de rotas que não devem exibir a NavBar
  const noNavBarRoutes = [
    "/login",
    "/register",
  ];

  // Verifica se a rota atual está na lista de rotas sem NavBar
  const shouldShowNavBar = !noNavBarRoutes.includes(location.pathname);

  return (
    <div className="layout-container">
      {/* Exibe a NavBar apenas se shouldShowNavBar for true */}
      {shouldShowNavBar && <NavBar />}

      {/* Conteúdo das páginas */}
      <div className={`content ${shouldShowNavBar ? "with-navbar" : "without-navbar"}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;