// src/controllers/userController.js
const db = require('../db/connection');
const jwt = require('jsonwebtoken');

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
