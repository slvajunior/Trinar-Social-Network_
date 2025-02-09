
// src/components/Post/Post.jsx
import React, { useState, useRef, useEffect } from "react";
import AuthorInfo from "../AuthorInfo";
import PostActions from "./PostActions";
import axios from "axios";
import { toast } from "react-toastify";
import "../Post.css";

const Post = ({ post, followingStatus, handleFollow, loggedInUserId, socket }) => {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef(null);
  const [reactionCounts, setReactionCounts] = useState({});
  const [userReaction, setUserReaction] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const reactionTimeout = useRef(null);

  const maxLength = 100; // Defina o número máximo de caracteres

  const calculateTextLength = (text) => {
    const lines = text.split("\n");
    let totalChars = 0;
    lines.forEach((line, index) => {
      totalChars += line.length;
      if (index < lines.length - 1) {
        totalChars += 58; // Adiciona 58 caracteres para cada quebra de linha
      }
    });
    return totalChars;
  };

  useEffect(() => {
    if (textRef.current && post.text) {
      const totalChars = calculateTextLength(post.text);
      setIsTruncated(totalChars > maxLength);
    }
  }, [post.text]);

  const truncateText = (text, maxLength) => {
    const lines = text.split("\n");
    let totalChars = 0;
    let truncatedText = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineLength = line.length;

      if (
        totalChars + lineLength + (i < lines.length - 1 ? 58 : 0) >
        maxLength
      ) {
        const remainingChars = maxLength - totalChars;
        truncatedText += line.slice(0, remainingChars) + "...";
        break;
      } else {
        truncatedText += line;
        totalChars += lineLength;

        if (i < lines.length - 1) {
          truncatedText += "\n";
          totalChars += 58;
        }
      }
    }

    return truncatedText;
  };

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`/api/posts/${post.id}/reactions/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const counts = response.data.reactions.reduce((acc, curr) => {
          acc[curr.reaction_type] = curr.count;
          return acc;
        }, {});

        setReactionCounts(counts);

        const userReactionResponse = await axios.get(
          `/api/posts/${post.id}/user_reaction/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserReaction(userReactionResponse.data.reaction_type);
      } catch (error) {
        console.error("Erro ao buscar reações:", error);
      }
    };

    if (loggedInUserId) fetchReactions();
  }, [post.id, loggedInUserId]);

  const handleReaction = async (emoji) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/add_reaction/",
        { post_id: post.id, reaction_type: emoji },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedCounts = response.data.reactions.reduce((acc, curr) => {
        acc[curr.reaction_type] = curr.count;
        return acc;
      }, {});

      setReactionCounts(updatedCounts);
      setUserReaction(emoji);
    } catch (error) {
      console.error("Erro ao atualizar reação:", error);
    }
  };

  const handleMouseEnterReactionPicker = () => {
    if (reactionTimeout.current) {
      clearTimeout(reactionTimeout.current);
    }
  };

  const handleMouseLeaveReactionPicker = () => {
    reactionTimeout.current = setTimeout(() => {
      setShowReactionPicker(false);
    }, 500);
  };

  // Lazy loading: load image/video only when they come into view
  const imgRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('loading', 'lazy');
          imgObserver.disconnect(); // Desconecta o observer após carregar a imagem
        }
      });
    });

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('loading', 'lazy');
          videoObserver.disconnect();
        }
      });
    });

    if (imgRef.current) imgObserver.observe(imgRef.current);
    if (videoRef.current) videoObserver.observe(videoRef.current);
  }, []);

  return (
    <div className="post-tl">
      <AuthorInfo
        author={post.author}
        followingStatus={followingStatus}
        handleFollow={handleFollow}
        loggedInUserId={loggedInUserId}
        post={post}
      />

      <p ref={textRef} className={`text-post ${expanded ? "" : ""}`}>
        {expanded ? post.text : truncateText(post.text, maxLength)}
      </p>
      {isTruncated && !expanded && (
        <span className="read-more" onClick={() => setExpanded(true)}>
          Ler mais
        </span>
      )}
      {expanded && (
        <span className="read-more" onClick={() => setExpanded(false)}>
          Mostrar menos
        </span>
      )}

      {post.photo_url && (
        <img
          ref={imgRef}
          className="img-post"
          src={post.photo_url}
          alt="Post"
        />
      )}
      {post.video_url && (
        <video
          ref={videoRef}
          className="video-post"
          controls
        >
          <source src={post.video_url} type="video/mp4" />
          Seu navegador não suporta vídeo.
        </video>
      )}

      {post.hashtags && post.hashtags.length > 0 && (
        <div className="post-hashtags">
          {post.hashtags.map((hashtag, index) => (
            <span key={index} className="hashtag">
              #{hashtag}
            </span>
          ))}
        </div>
      )}

      <hr className="divider-post-tl" />
      <PostActions
        post={post}
        loggedInUserId={loggedInUserId}
        socket={socket}
        reactionCounts={reactionCounts}
        userReaction={userReaction}
        showReactionPicker={showReactionPicker}
        setShowReactionPicker={setShowReactionPicker}
        handleReaction={handleReaction}
        handleMouseEnterReactionPicker={handleMouseEnterReactionPicker}
        handleMouseLeaveReactionPicker={handleMouseLeaveReactionPicker}
      />
    </div>
  );
};

export default Post;