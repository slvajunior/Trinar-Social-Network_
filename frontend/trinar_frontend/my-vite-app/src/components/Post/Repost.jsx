
// src/components/Post/Repost.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRetweet } from "@fortawesome/free-solid-svg-icons";

const Repost = ({ post, loggedInUserId, socket }) => {
  const handleRepost = () => {
    // Lógica para abrir o modal de repost e enviar repost
    console.log("Abrir modal de repost");
  };

  return (
    <button className="action-button-tl" onClick={handleRepost}>
      <FontAwesomeIcon icon={faRetweet} /> Reposte
    </button>
  );
};

export default Repost;