// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const userImages = require('../controllers/userImagesController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController'); // Importa o authController
const chatController = require('../controllers/chatController'); // Importa o chatController
const authenticateToken = require('../middleware/authMiddleware'); // Corrigindo a importação
const authMiddleware = require('../middleware/authMiddleware'); // Corrigindo a importação

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


// Rota para criar uma nova sala de chat
router.post('/create', authMiddleware, chatController.createChatRoom);

// Rota para listar conversas para o usuário autenticado
router.get('/conversations', authMiddleware, chatController.getConversations);

// Rota para listar mensagens de uma sala de chat específica
router.get('/messages/:chatRoomId', authMiddleware, chatController.getMessages);

// Rota para enviar uma mensagem
router.post('/send', authMiddleware, chatController.sendMessage);

// Rota para obter os detalhes dos contatos (matches ou solicitações)
router.get('/contacts', authMiddleware, chatController.getContactsDetails);
// src/routes/userRoutes.js

// Rota para atualizar o perfil do usuário
router.put('/profile', authenticateToken, userController.updateUserProfile);

router.get('/recommendations', authenticateToken, userController.recommendUsers);
// src/routes/userRoutes.js
router.post('/update-filter-distance', authenticateToken, userController.updateFilterDistance);


// Rota para upload de uma ou múltiplas imagens
router.post('/upload-images', upload.array('images'), userImages.uploadImages);

// Rota para buscar imagens de um usuário
router.get('/user-images/:userId', userImages.getUserImages);
router.post('/upload-profile-image', upload.single('image'), userImages.uploadProfileImage);

// Rota para buscar as imagens do usuário
router.get('/user-images/:userId', userImages.getUserImages);
// Rota para excluir uma imagem
router.delete('/delete-image/:imageId', userImages.deleteImage);

// Rota para registrar um novo usuário
router.post('/register', userController.registerUser);
module.exports = router;
