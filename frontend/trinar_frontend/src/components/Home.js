import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  // Estado para armazenar os posts (Trinados)
  const [posts, setPosts] = useState([]);

  // Simulação de fetch dos posts
  useEffect(() => {
    // Aqui você pode chamar a API para buscar os posts reais
    const fetchPosts = async () => {
      // Exemplo de posts simulados
      const postsData = [
        { id: 1, user: "João", content: "Meu primeiro Trinado!", date: "2025-01-15" },
        { id: 2, user: "Maria", content: "Explorando o Trinar!", date: "2025-01-14" },
        // Mais posts aqui
      ];
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Bem-vindo ao Trinar!</h1>
      <nav>
        <Link to="/register">Registrar</Link> | <Link to="/login">Entrar</Link> |{" "}
        <Link to="/logout">Sair</Link>
      </nav>

      <div className="timeline">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h3>{post.user}</h3>
            <p>{post.content}</p>
            <small>{post.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
