// src/components/Timeline.js
import React from "react";
import { FaThumbsUp, FaRetweet, FaComment } from "react-icons/fa"; // Importe os ícones

import "./Timeline.css";

const Timeline = () => {
  return (
    <div className="timeline-container">
      {/* Primeiro post */}
      <div className="post">
        <div className="post-content">
          <p>
            Eu não sei vocês mas sei la eu.
          </p>
          <hr className="divider" />
          <ul className="lista-icones">
            <li>
              <FaThumbsUp /> {/* Ícone de like */}
              <span>Like</span>
            </li>
            <li>
              <FaRetweet /> {/* Ícone de repost */}
              <span>Repost</span>
            </li>
            <li>
              <FaComment /> {/* Ícone de comments */}
              <span>Comments</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Segundo post */}
      <div className="post">
        <div className="post-content">
          <p>
            isso de querer
            <br />
            ser exatamente aquilo
            <br />
            que a gente é
            <br />
            ainda vai
            <br />
            nos levar além
            <br />
            <br />
            Paulo Leminski
          </p>
          <hr className="divider" />
          <ul className="lista-icones">
            <li>
              <FaThumbsUp /> {/* Ícone de like */}
              <span>Like</span>
            </li>
            <li>
              <FaRetweet /> {/* Ícone de repost */}
              <span>Repost</span>
            </li>
            <li>
              <FaComment /> {/* Ícone de comments */}
              <span>Comments</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Timeline;