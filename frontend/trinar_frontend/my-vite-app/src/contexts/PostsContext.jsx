// src/contexts/PostsContext.jsx
import React, { createContext, useState, useContext } from "react";

const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  return (
    <PostsContext.Provider
      value={{
        posts,
        setPosts,
        followingStatus,
        setFollowingStatus,
        isLoading,
        setIsLoading,
        page,
        setPage,
        hasMore,
        setHasMore,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);