// src/controllers/authController.js
const db = require('../db/connection'); // Certifique-se de que está importando sua conexão com o banco de dados
const jwt = require('jsonwebtoken');
const secretKey = 'seuSegredo'; // A mesma chave que você usou para assinar o token

const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [user] = await db.query(query, [email]);
  
        if (!user || user.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
  
        if (user[0].password !== password) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }
  
        const token = jwt.sign({ id: user[0].id, email: user[0].email }, secretKey, { expiresIn: '1h' });
        
        // Retorna o token e o ID do usuário
        res.json({ 
            token: token,
            userId: user[0].id,
            message: 'Login bem-sucedido'
        });
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).json({ message: 'Erro ao realizar login', error: error.message });
    }
  };
module.exports = {
    login,
};
