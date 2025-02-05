// src/components/Timeline.jsx
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
      const response = await axios.get(`/api/timeline/?page=${page}&page_size=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      if (data.results.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...data.results]);

        // Verificar o status de "seguir" para cada autor dos posts
        const uniqueAuthors = [...new Set(data.results.map((post) => post.author.id))];

        const followStatuses = await Promise.all(
          uniqueAuthors.map((authorId) => {
            // Verificar se já fizemos uma requisição para esse autor
            if (followingStatus[authorId] !== undefined) {
              return Promise.resolve({
                userId: authorId,
                isFollowing: followingStatus[authorId],
              });
            }

            return axios
              .get(`/api/users/${authorId}/is-following/`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((res) => ({
                userId: authorId,
                isFollowing: res.data.is_following,
              }))
              .catch(() => ({ userId: authorId, isFollowing: false }));
          })
        );

        // Atualizar o estado followingStatus
        const statusMap = followStatuses.reduce((acc, item) => {
          acc[item.userId] = item.isFollowing;
          return acc;
        }, {});
        setFollowingStatus((prevState) => ({ ...prevState, ...statusMap }));

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
  }, [page, hasMore, isLoading, token, followingStatus, setPosts, setFollowingStatus, setHasMore, setPage, setIsLoading]);

  // Carregar posts iniciais
  useEffect(() => {
    if (loggedInUserId && token && posts.length === 0) {
      fetchPosts();
    }
  }, [loggedInUserId, token, fetchPosts, posts.length]);

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

  // Configurar o Polling para buscar novos posts periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        fetchPosts(); // Busca novos posts a cada 10 segundos
      }
    }, 10000); // Intervalo de 10 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [isLoading, fetchPosts]);

  // Conectar ao WebSocket para atualizações em tempo real
  useEffect(() => {
    if (token) {
      const socketConnection = new WebSocket(`ws://localhost:8001/ws/timeline/`);

      socketConnection.onopen = () => {
        console.log("Conexão WebSocket estabelecida!");
      };

      socketConnection.onmessage = (event) => {
        const newPost = JSON.parse(event.data);
        setPosts((prevPosts) => [newPost, ...prevPosts]); // Adiciona o novo post ao topo da timeline
      };

      socketConnection.onclose = () => {
        console.log("Conexão WebSocket fechada.");
      };

      socketConnection.onerror = (error) => {
        console.error("Erro no WebSocket:", error);
      };

      setSocket(socketConnection); // Armazena a conexão no estado

      // Limpeza ao desmontar o componente
      return () => {
        socketConnection.close();
      };
    }
  }, [token]);

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