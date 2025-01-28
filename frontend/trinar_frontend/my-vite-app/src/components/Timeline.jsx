// src/components/Timeline.jsx

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Post from "./Post";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Timeline.css";

function Timeline() {
  const [posts, setPosts] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Verifica se o usuário está logado
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Buscar os posts da timeline
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
        const followStatuses = await Promise.all(
          data.results.map((post) =>
            axios
              .get(`/api/users/${post.author.id}/is-following/`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((res) => ({
                userId: post.author.id,
                isFollowing: res.data.is_following,
              }))
              .catch(() => ({ userId: post.author.id, isFollowing: false }))
          )
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
  }, [page, hasMore, isLoading, token]);

  // Carregar posts iniciais
  useEffect(() => {
    if (loggedInUserId && token) fetchPosts();
  }, [loggedInUserId, token, fetchPosts]);

  // Função para seguir um usuário
  const handleFollow = async (userId) => {
    if (userId === loggedInUserId) {
      console.warn("Você não pode seguir a si mesmo.");
      return;
    }
    try {
      const response = await axios.post(`/api/users/${userId}/follow/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setFollowingStatus((prevState) => ({ ...prevState, [userId]: true }));
        toast.success("Agora você está seguindo este usuário!");
      }
    } catch (err) {
      toast.error("Erro ao seguir usuário. Tente novamente.");
    }
  };

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
      <div id="sentinel" style={{ height: "10px" }}></div>
    </div>
  );
}

export default Timeline;