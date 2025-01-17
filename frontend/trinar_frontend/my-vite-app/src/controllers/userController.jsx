// src/controllers/userController.js
const User = require("../models/User"); // Supondo que você já tem um modelo de usuário

const getProfile = async (req, res) => {
  try {
    const userId = req.userId; // ID do usuário extraído do token

    // Busca o usuário no banco de dados
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Retorna os dados do usuário (exceto a senha)
    const userData = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

module.exports = { getProfile };