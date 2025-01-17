// src/routes/userRoutes.jsx
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

const router = express.Router();

// Rota protegida para obter o perfil do usuário
router.get("/user", authMiddleware, userController.getProfile);

module.exports = router;