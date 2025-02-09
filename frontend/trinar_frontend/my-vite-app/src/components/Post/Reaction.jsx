
// src/components/Post/Reaction.jsx
import React from "react";
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
}) => {
  const totalReactions = Object.values(reactionCounts).reduce(
    (acc, count) => acc + count,
    0
  );

  const reactionTypes = [
    { emoji: "❤️", label: "Heart" },
    { emoji: "😂", label: "Laugh" },
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
    </div>
  );
};

export default Reaction;