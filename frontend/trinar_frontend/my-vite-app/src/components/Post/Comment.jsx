
// src/components/Post/Comment.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";

const Comment = ({ post, loggedInUserId, socket }) => {
  const handleComment = () => {
    // Lógica para abrir o modal de comentários e enviar comentários
    console.log("Abrir modal de comentários");
  };

  return (
    <button className="action-button-tl" onClick={handleComment}>
      <FontAwesomeIcon icon={faComment} /> Comente
    </button>
  );
};

export default Comment;