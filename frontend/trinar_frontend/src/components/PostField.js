// src/components/PostField.js

import React, { useState } from "react";
import "./PostField.css";

const PostField = () => {
  const [content, setContent] = useState("");

  return (
    <div className="post-field-container">
      <textarea
        className="post-input"
        placeholder="O que você quer compartilhar?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button className="post-button">Postar</button>
      {content && (
        <div className="post-preview">
          <h4>Preview:</h4>
          <p>{content}</p>
        </div>
      )}
    </div>
  );
};

export default PostField;
