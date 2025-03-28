import React, { useState } from "react";
import { motion } from "framer-motion"; // Importe o Framer Motion

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
              <motion.div
                className="reaction-tooltip"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                {reactionUsers[emoji].map((user, index) => (
                  <div key={index}>{user}</div>
                ))}
              </motion.div>
            )}
        </div>
      ))}
    </div>
  );
};

export default ReactionAccumulator;