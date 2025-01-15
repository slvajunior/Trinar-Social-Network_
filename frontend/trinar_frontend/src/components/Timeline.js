// src/components/Timeline.js
import React from "react";
import { FaThumbsUp, FaRetweet, FaComment } from "react-icons/fa"; // Importe os ícones
import "./Timeline.css";

const Timeline = () => {
  return (
    <div className="timeline-container">
      <div className="post">
        <p>
          Eu não sei vocês mas sei la eu.
          <hr />
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
        </p>
      </div>
      <div className="post">
        <p>
          isso de querer
          <br />
          ser exatamente aquilo
          <br />
          que a gente é
          <br />
          ainda vai
          <br />
          nos levar além
          <br />
          <br />
          Paulo Leminski
          <hr />
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
        </p>
      </div>
    </div>
  );
};

export default Timeline;
