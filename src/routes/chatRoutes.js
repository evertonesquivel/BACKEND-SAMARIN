const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticateToken = require('../middleware/authMiddleware');

// Criar nova sala de chat
router.post('/create', authenticateToken, chatController.createChatRoom);

// Obter conversas
router.get('/conversations', authenticateToken, chatController.getConversations);

// Obter mensagens da sala
router.get('/messages/:chatRoomId', authenticateToken, chatController.getMessages);

// Enviar mensagem
router.post('/send', authenticateToken, chatController.sendMessage); // <- corrigido aqui

// Obter contatos do usuário
router.get('/contacts', authenticateToken, chatController.getContactsDetails);

module.exports = router;
