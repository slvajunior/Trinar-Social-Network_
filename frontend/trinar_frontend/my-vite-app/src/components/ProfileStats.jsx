// src/components/ProfileStats.jsx
import React from "react";

const ProfileStats = ({ followingCount, followersCount }) => {
  return (
    <div className="profile-page-info">
      <p className="profile-page-stats">
        <strong className="number-follow">{followingCount}</strong> Seguindo
      </p>
      <p className="profile-page-stats">
        <strong className="number-follow">{followersCount}</strong> Seguidores
      </p>
    </div>
  );
};

export default ProfileStats;