// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware'); // para proteger rotas

// Rota de login
router.post('/login', authController.login);

// Rota para renovar o token de acesso
router.post('/refresh-token', authController.refreshAccessToken);

// Rota de logout
router.post('/logout', authController.logout);

// Atualizar localização do usuário autenticado
router.post('/update-location', authenticateToken, authController.updateLocation);

module.exports = router;
