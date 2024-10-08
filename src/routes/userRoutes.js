const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const User = require('../models/user');
const { login, getUserProfile } = userController; // Extrair diretamente do controller
const authenticateToken = require('../middleware/authMiddleware'); // Corrigindo a importação

// Rota para login
router.post('/login', login);

// Rota para obter o perfil do usuário autenticado
router.get('/profile', authenticateToken, getUserProfile); // Protege a rota de perfil com o middleware

// Rota para listar todos os usuários
router.get('/users', userController.getAllUsers); // Ajuste esta linha se necessário

// Rota para obter um usuário específico
router.get('/users/:id', userController.getUserById);

// Rota para obter um usuário específico pelo ID
router.get('/profile/:id', async (req, res) => {
    const userId = req.params.id;
  
    // Verificar se o ID é um número válido
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID inválido. O ID deve ser numérico.' });
    }
  
    try {
      const query = 'SELECT * FROM users WHERE id = ?';
      const [user] = await db.query(query, [userId]);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      // Retorna os dados do usuário
      res.json({
        id: user.id,
        name: user.name,
        age: user.age,
        images: user.images,
        infos: user.infos,
        email: user.email,
        nickname: user.nickname,
        city: user.city,
        state: user.state,
        identification: user.identification,
        interest: user.interest,
        ageRange: user.ageRange,
        specificInterests: user.specificInterests,
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao recuperar o usuário.' });
    }
  });

module.exports = router;
