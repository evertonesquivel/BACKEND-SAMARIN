const db = require('../db/connection');
const jwt = require('jsonwebtoken');
const secretKey = 'seuSegredo'; // Defina uma chave secreta para assinar o token

// Função para gerar um token
function generateToken(userId) {
    const payload = { id: userId }; // Payload do token
    return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expira em 1 hora
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
        const [results] = await db.query('SELECT * FROM users WHERE id = ?', [userId]); // Ajuste conforme sua tabela
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        return res.json(results[0]);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar o usuário.' });
    }
};

// Login do usuário
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]); // Altere conforme sua tabela
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        const token = generateToken(user.id); // Gera um token para o usuário
        return res.json({ token, user }); // Retorna o token e os dados do usuário
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao autenticar' });
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
