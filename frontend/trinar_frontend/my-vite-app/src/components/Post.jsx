// src/components/Post.jsx
import React from "react";
import AuthorInfo from "./AuthorInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faRetweet } from "@fortawesome/free-solid-svg-icons";
import "./Post.css";

const Post = ({ post, followingStatus, handleFollow, loggedInUserId }) => {

  return (
    <div className="post">
      <AuthorInfo
        author={post.author}
        followingStatus={followingStatus}
        handleFollow={handleFollow}
        loggedInUserId={loggedInUserId}
        post={post}
      />
      <p className="text-post">{post.text}</p>
      {post.photo_url && (
        <img
          className="img-post"
          src={post.photo_url}
          alt="Post"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "caminho/para/imagem/padrao.png";
          }}
        />
      )}
      {post.video_url && (
        <video className="video-post" controls loading="lazy">
          <source src={post.video_url} type="video/mp4" />
          Seu navegador não suporta vídeo.
        </video>
      )}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="post-hashtags">
          {post.hashtags.map((hashtag, index) => (
            <span key={index} className="hashtag">
              #{hashtag}
            </span>
          ))}
        </div>
      )}
      <hr className="divider-post" />
      <div className="post-actions">
        <button className="action-button">
          <FontAwesomeIcon icon={faHeart} /> Curtir
        </button>
        <button className="action-button">
          <FontAwesomeIcon icon={faComment} /> Comentar
        </button>
        <button className="action-button">
          <FontAwesomeIcon icon={faRetweet} /> Repostar
        </button>
      </div>
    </div>
  );
};

export default Post;