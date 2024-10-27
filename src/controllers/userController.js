// src/controllers/userController.js
const db = require('../db/connection');
const jwt = require('jsonwebtoken');
const Location = require('../models/Location');

exports.hello =  (req, res) => {
    res.send('Hello World, API!');
}

// Recupera todos os usuários
exports.getAllUsers = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM users'); // Ajuste conforme sua tabela
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar usuários.' });
    }
};

// Recupera um usuário pelo ID
exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const [results] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        return res.json(results[0]);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar o usuário.' });
    }
};


// Recupera o perfil do usuário autenticado
exports.getUserProfile = async (req, res) => {
    const userId = req.user.id; // O ID do usuário foi adicionado ao req.user pelo middleware
    try {
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao buscar perfil' });
    }
};


// Função para registrar like ou dislike
exports.likeOrDislike = async (req, res) => {
    const { userId, targetUserId, like } = req.body;
  
    try {
      // Registra o like ou dislike no banco de dados
      const [insertResult] = await db.query('INSERT INTO user_likes (user_id, liked_user_id, is_like) VALUES (?, ?, ?)', [userId, targetUserId, like]);
      const likeId = insertResult.insertId; // Obtém o ID do like inserido
  
      // Verifica se o outro usuário já deu like
      const [rows] = await db.query('SELECT * FROM user_likes WHERE user_id = ? AND liked_user_id = ? AND is_like = TRUE', [targetUserId, userId]);
  
      if (rows.length > 0) {
        // Se o outro usuário já deu like, é um like mútuo
        const mutualLikeId = rows[0].id;
  
        // Insere na tabela Matchs
        await db.query(
          'INSERT INTO Matchs (matcher_id, matchee_id, matcher_like_id, matchee_like_id, date) VALUES (?, ?, ?, ?, ?)', 
          [userId, targetUserId, likeId, mutualLikeId, new Date()]
        );
  
        return res.json({ isMutual: true });
      }
  
      // Se não, apenas retorna que foi registrado
      return res.json({ isMutual: false });
    } catch (error) {
      console.error('Erro ao registrar like ou dislike:', error);
      return res.status(500).json({ message: 'Erro ao registrar like ou dislike' });
    }
  };
  // Função para obter a localização do usuário autenticado
 
exports.getUserLocation = async (req, res) => {
    try {
        const userId = req.body.id; // Obtendo o ID do usuário do corpo da solicitação

        // Certifique-se de que o ID do usuário foi enviado
        if (!userId) {
            return res.status(400).json({ message: "User  ID is required." });
        }

        // Buscando a localização do usuário no banco de dados
        const location = await Location.findOne({
            where: { users_id: userId } // Usando o ID do usuário para buscar a localização
        });

        if (!location) {
            return res.status(404).json({ message: "Location not found." });
        }

        // Retornando a localização encontrada
        res.status(200).json(location);
    } catch (error) {
        console.error("Error retrieving location:", error);
        res.status(500).json({ message: "Error retrieving location." });
    }
};