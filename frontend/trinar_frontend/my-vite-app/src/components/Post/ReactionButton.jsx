// src/components/Post/ReactionButton.jsx

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const ReactionButton = ({
  userReaction,
  showReactionPicker,
  setShowReactionPicker,
  handleReaction,
  handleMouseEnterReactionPicker,
  handleMouseLeaveReactionPicker,
  reactionCounts, // Adicione reactionCounts como prop
}) => {
  // Calcular o total de reações
  const totalReactions = Object.values(reactionCounts).reduce(
    (acc, count) => acc + count,
    0
  );

  return (
    <div
      className="reaction-container"
      onMouseEnter={handleMouseEnterReactionPicker}
      onMouseLeave={handleMouseLeaveReactionPicker}
    >
      <button
        className="action-button-tl reaction-button"
        onClick={() => setShowReactionPicker(!showReactionPicker)}
      >
        <span className="reaction-preview">
          {userReaction ? userReaction : <FontAwesomeIcon icon={faHeart} />}
        </span>
        {/* Exibir o contador de reações */}
        <span className="reaction-count">{totalReactions}</span>
      </button>

      {showReactionPicker && (
        <div className="reaction-picker">
          {["❤️", "🤣", "😮", "😢", "👍", "🤬", "🙄"].map((emoji) => (
            <button
              key={emoji}
              className="reaction-option"
              onClick={() => handleReaction(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionButton;