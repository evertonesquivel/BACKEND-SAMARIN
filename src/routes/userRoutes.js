// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware'); // Corrigindo a importação

//ROTAS 

router.get('/', userController.hello)
// Rota para obter o perfil do usuário autenticado
router.get('/profile', authenticateToken, userController.getUserProfile); // Protege a rota de perfil com o middleware

// Rota para listar todos os usuários
router.get('/users', userController.getAllUsers); // Ajuste esta linha se necessário

// Rota para obter um usuário específico pelo ID
router.get('/users/:id', userController.getUserById);

// Rota para registrar like ou dislike
router.post('/like', userController.likeOrDislike);

router.get('/location', authenticateToken, userController.getUserLocation);
// src/routes/userRoutes.js
router.post('/location', authenticateToken, userController.getUserLocation);

// Rota para atualizar o perfil do usuário
router.put('/profile', authenticateToken, userController.updateUserProfile);

router.get('/recommendations', authenticateToken, userController.recommendUsers);
// src/routes/userRoutes.js
router.post('/update-filter-distance', authenticateToken, userController.updateFilterDistance);
// Rota para registrar um novo usuário
router.post('/register', userController.registerUser);

module.exports = router;
