// src/components/Post/PostActions.jsx

import React from "react";
import ReactionButton from "./ReactionButton";
import Comment from "./Comment";
import Repost from "./Repost";

const PostActions = ({
  post,
  loggedInUserId,
  socket,
  userReaction,
  showReactionPicker,
  setShowReactionPicker,
  handleReaction,
  handleMouseEnterReactionPicker,
  handleMouseLeaveReactionPicker,
  reactionCounts, // Adicione reactionCounts como prop
}) => {
  return (
    <div className="post-actions-tl">
      <ReactionButton
        userReaction={userReaction}
        showReactionPicker={showReactionPicker}
        setShowReactionPicker={setShowReactionPicker}
        handleReaction={handleReaction}
        handleMouseEnterReactionPicker={handleMouseEnterReactionPicker}
        handleMouseLeaveReactionPicker={handleMouseLeaveReactionPicker}
        reactionCounts={reactionCounts} // Passe reactionCounts para o ReactionButton
      />

      <Comment post={post} loggedInUserId={loggedInUserId} socket={socket} />

      <Repost post={post} loggedInUserId={loggedInUserId} socket={socket} />
    </div>
  );
};

export default PostActions;