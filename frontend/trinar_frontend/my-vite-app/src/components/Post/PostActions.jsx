
// src/components/Post/PostActions.jsx

import React from "react";
import Reaction from "./Reaction";
import Comment from "./Comment";
import Repost from "./Repost";

const PostActions = ({
  post,
  loggedInUserId,
  socket,
  reactionCounts,
  userReaction,
  showReactionPicker,
  setShowReactionPicker,
  handleReaction,
  handleMouseEnterReactionPicker,
  handleMouseLeaveReactionPicker,
}) => {
  return (
    <div className="post-actions-tl">
      <Reaction
        post={post}
        loggedInUserId={loggedInUserId}
        reactionCounts={reactionCounts}
        userReaction={userReaction}
        showReactionPicker={showReactionPicker}
        setShowReactionPicker={setShowReactionPicker}
        handleReaction={handleReaction}
        handleMouseEnterReactionPicker={handleMouseEnterReactionPicker}
        handleMouseLeaveReactionPicker={handleMouseLeaveReactionPicker}
      />

      <Comment post={post} loggedInUserId={loggedInUserId} socket={socket} />

      <Repost post={post} loggedInUserId={loggedInUserId} socket={socket} />
    </div>
  );
};

export default PostActions;