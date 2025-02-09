import React, { useEffect, useCallback, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../contexts/PostsContext"; // Importe o hook do contexto
import Post from "./Post";
import "./Timeline.css";

function Timeline() {
  const {
    posts,
    setPosts,
    followingStatus,
    setFollowingStatus,
    isLoading,
    setIsLoading,
    page,
    setPage,
    hasMore,
    setHasMore,
  } = usePosts(); // Use os valores do contexto

  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const sentinelRef = useRef(null);
  const [socket, setSocket] = useState(null); // Estado para armazenar o WebSocket

  // Verifica se o usuário está logado
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Função para buscar os posts da timeline
  const fetchPosts = useCallback(async () => {
    if (!hasMore || isLoading || !token) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/timeline/?page=${page}&page_size=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      if (data.results.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...data.results]);
        setHasMore(data.next !== null);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      toast.error("Erro ao carregar posts.");
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    hasMore,
    isLoading,
    token,
    setPosts,
    setHasMore,
    setPage,
    setIsLoading,
  ]);

  // Configurar o IntersectionObserver para carregar mais posts ao rolar
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchPosts();
        }
      },
      { threshold: 1.0 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [hasMore, isLoading, fetchPosts]);

  // Função para seguir um usuário
  const handleFollow = async (userId) => {
    if (userId === loggedInUserId) {
      console.warn("Você não pode seguir a si mesmo.");
      return;
    }
    try {
      const response = await axios.post(
        `/api/users/${userId}/follow/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setFollowingStatus((prevState) => ({ ...prevState, [userId]: true }));
        toast.success("Agora você está seguindo este usuário!");
      }
    } catch (err) {
      toast.error("Erro ao seguir usuário. Tente novamente.");
    }
  };

  // Conectar ao WebSocket para atualizações em tempo real
  useEffect(() => {
    if (!token) return;
  
    const connectWebSocket = () => {
      const socketConnection = new WebSocket(`ws://127.0.0.1:8001/ws/chat/sala1/`);
  
      socketConnection.onopen = () => {
        console.log("Conexão WebSocket estabelecida!");
      };
  
      socketConnection.onmessage = (event) => {
        const newPost = JSON.parse(event.data);
        if (!posts.some((post) => post.id === newPost.id)) {
          setPosts((prevPosts) => [newPost, ...prevPosts]);
        }
      };
  
      socketConnection.onclose = (event) => {
        console.log("Conexão WebSocket fechada. Código:", event.code, "Motivo:", event.reason);
        if (event.code !== 1000) {
          console.log("Tentando reconectar em 3 segundos...");
          setTimeout(connectWebSocket, 3000);
        }
      };
  
      socketConnection.onerror = (error) => {
        console.error("Erro no WebSocket:", error);
      };
  
      setSocket(socketConnection);
    };
  
    connectWebSocket();
  
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [token, posts]);

  return (
    <div>
      {posts.map((post, index) => (
        <Post
          key={`${post.id}-${index}`}
          post={post}
          followingStatus={followingStatus}
          handleFollow={handleFollow}
          loggedInUserId={loggedInUserId}
        />
      ))}
      <div ref={sentinelRef} id="sentinel" style={{ height: "10px" }}></div>
      {isLoading && <p>Carregando mais posts...</p>}
      {!hasMore && <p>Não há mais posts para carregar.</p>}
    </div>
  );
}

export default Timeline;
