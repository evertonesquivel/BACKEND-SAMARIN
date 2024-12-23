// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController'); // Importa o authController
const authenticateToken = require('../middleware/authMiddleware'); // Corrigindo a importação

router.get('/', userController.hello)
// Rota para obter o perfil do usuário autenticado
router.get('/profile', authenticateToken, userController.getUserProfile); // Protege a rota de perfil com o middleware

// Rota para listar todos os usuários
router.get('/users', userController.getAllUsers); // Ajuste esta linha se necessário

// Rota para obter um usuário específico pelo ID
router.get('/users/:id', userController.getUserById);

// Rota para login
router.post('/login', authController.login); // Mantendo esta rota para login

// Rota para renovar o token de acesso
router.post('/refresh-token', authController.refreshAccessToken);

// Rota de logout
router.post('/logout', authController.logout); // Certifique-se de que a rota esteja definida aqui

// Rota para registrar like ou dislike
router.post('/like', userController.likeOrDislike);
router.post('/update-location', authenticateToken, authController.updateLocation);
router.get('/location', authenticateToken, userController.getUserLocation);
// src/routes/userRoutes.js
router.post('/location', authenticateToken, userController.getUserLocation);
module.exports = router;
