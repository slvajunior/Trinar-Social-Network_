import React, { useState } from "react";

const ReactionAccumulator = ({ reactionCounts, reactionUsers }) => {
  const [hoveredEmoji, setHoveredEmoji] = useState(null);

  console.log("reactionUsers:", reactionUsers); // Verifique os dados recebidos
  console.log("hoveredEmoji:", hoveredEmoji); // Verifique o emoji atualmente em hover

  return (
    <div className="reaction-accumulator">
      {Object.keys(reactionCounts).map((emoji) => (
        <div
          key={emoji}
          className="reaction-icon"
          onMouseEnter={() => setHoveredEmoji(emoji)}
          onMouseLeave={() => setHoveredEmoji(null)}
        >
          {emoji}
          {hoveredEmoji === emoji &&
            Array.isArray(reactionUsers[emoji]) && // Verifica se é um array
            reactionUsers[emoji].length > 0 && (  // Verifica se o array não está vazio
              <div className="reaction-tooltip">
                {reactionUsers[emoji].join(", ")}
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default ReactionAccumulator;