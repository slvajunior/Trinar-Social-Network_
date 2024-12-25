// components/Home.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();  // Usando useNavigate para navegação
  const [posts, setPosts] = useState([]);

  // Carregar postagens
  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login");  // Redireciona para login caso não tenha token
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/posts/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        setPosts(result);
      } catch (err) {
        console.error("Erro ao buscar postagens:", err);
      }
    };

    fetchPosts();
  }, [navigate]);  // Atualiza quando `navigate` mudar

  return (
    <div>
      <h2>Timeline</h2>
      {posts.length === 0 ? (
        <p>Nenhuma postagem encontrada.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post">
            <p>{post.text}</p>
            <small>Postado em: {new Date(post.created_at).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
