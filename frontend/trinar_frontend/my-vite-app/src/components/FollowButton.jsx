// src/components/FollowButton.jsx
import React from "react";

const FollowButton = ({ isFollowing, handleFollow, handleUnfollow }) => {
  return (
    <button
      onClick={isFollowing ? handleUnfollow : handleFollow}
      className={
        isFollowing
          ? "profile-page-unfollow-button"
          : "profile-page-follow-button"
      }
    >
      {isFollowing ? "Desseguir" : "Seguir"}
    </button>
  );
};

export default FollowButton;