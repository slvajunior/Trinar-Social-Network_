import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Reaction = ({
  post,
  loggedInUserId,
  reactionCounts,
  userReaction,
  showReactionPicker,
  setShowReactionPicker,
  handleReaction,
  handleMouseEnterReactionPicker,
  handleMouseLeaveReactionPicker,
  reactionUsers = {}, // Valor padrão para evitar undefined
}) => {
  const totalReactions = Object.values(reactionCounts).reduce(
    (acc, count) => acc + count,
    0
  );

  const reactionTypes = [
    { emoji: "❤️", label: "Heart" },
    { emoji: "🤣", label: "Laugh" },
    { emoji: "😮", label: "Wow" },
    { emoji: "😢", label: "Sad" },
    { emoji: "👍", label: "Thumbs Up" },
    { emoji: "🤬", label: "Angry" },
    { emoji: "🙄", label: "Eye Roll" },
  ];

  const ReactionPicker = () => (
    <div className="reaction-picker">
      {reactionTypes.map(({ emoji, label }) => (
        <button
          key={emoji}
          className="reaction-option"
          onClick={() => handleReaction(emoji)}
          aria-label={label}
        >
          {emoji}
        </button>
      ))}
    </div>
  );

  const [hoveredEmoji, setHoveredEmoji] = useState(null);

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
        <span className="reaction-count">{totalReactions}</span>
      </button>

      {showReactionPicker && <ReactionPicker />}

      <div className="reaction-accumulator">
        {Object.keys(reactionCounts).map((emoji) => (
          <div
            key={emoji}
            className="reaction-icon"
            onMouseEnter={() => setHoveredEmoji(emoji)}
            onMouseLeave={() => setHoveredEmoji(null)}
          >
            {emoji}
            {hoveredEmoji === emoji &&
              Array.isArray(reactionUsers[emoji]) && // Verifica se é um array
              reactionUsers[emoji].length > 0 && (  // Verifica se o array não está vazio
                <div className="reaction-tooltip">
                  {reactionUsers[emoji].join(", ")}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reaction;