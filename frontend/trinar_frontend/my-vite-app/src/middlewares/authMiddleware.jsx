// src/middlewares/authMiddleware.jsx
const jwt = require("jsonwebtoken");
const SECRET_KEY = "sua-chave-secreta"; // Use a mesma chave usada para gerar o token

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.id; // Adiciona o ID do usuário ao objeto `req`
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido." });
  }
};

module.exports = authMiddleware;