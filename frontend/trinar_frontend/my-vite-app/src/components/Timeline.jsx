import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faRetweet } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./Timeline.css";

function Timeline() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/timeline/");
      if (!response.ok) {
        throw new Error("Não foi possível carregar os posts");
      }
      const data = await response.json();
      console.log("Dados retornados pelo backend:", data);
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderUserPhoto = (profile_picture) => {
    if (profile_picture) {
      return <img src={`http://localhost:8000${profile_picture}`} alt="Profile" className="profile-photo" />;
    } else {
      return <FaUserCircle className="user-photo" size={55} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  };

  return (
    <div className="timeline">
      {isLoading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="post" style={{ width: "675px", margin: "10px auto" }}>
                <div className="author-info">
                  <div className="author-photo">
                    <Link to={`/profile/${post.author?.id}`}>
                      {renderUserPhoto(post.author?.profile_picture)}
                    </Link>
                  </div>
                  <div className="author-details">
                    <strong>
                      {post.author?.first_name} {post.author?.last_name}
                    </strong>
                    <p>Publicado em: {formatDate(post.created_at)}</p>
                  </div>
                </div>
                <p className="text-post">{post.text}</p>

                {/* Renderização de Fotos */}
                {post.photo_url && (
                  <img className="img-post"
                    src={`http://localhost:8000${post.photo_url}`}
                    alt="Post"
                    style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
                  />
                )}

                {/* Renderização de Vídeos */}
                {post.video_url && (
                  <video className="img-post"
                    controls
                    style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
                  >
                    <source src={`http://localhost:8000${post.video_url}`} type="video/mp4" />
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                )}

                <p className="text-post">{post.visibility}</p>
                {post.hashtags.length > 0 && (
                  <p className="text-post">Hashtags: {post.hashtags.join(", ")}</p>
                )}
                <hr className="divider-post" />
                <div className="post-actions">
                  <button className="action-button">
                    <FontAwesomeIcon icon={faHeart} size="lg" /> Curtir
                  </button>
                  <button className="action-button">
                    <FontAwesomeIcon icon={faComment} size="lg" /> Comentar
                  </button>
                  <button className="action-button">
                    <FontAwesomeIcon icon={faRetweet} size="lg" /> Repostar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Sem posts para exibir.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Timeline;