// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = 'seuSegredo'; // A mesma chave que você usou para assinar o token

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Expecta o token no formato "Bearer token"

    if (!token) return res.sendStatus(401); // Se não houver token, retorna 401 (Unauthorized)

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403); // Se o token não for válido, retorna 403 (Forbidden)
        req.user = user; // Salva os dados do usuário decodificado na requisição
        next(); // Passa para a próxima função de middleware ou rota
    });
};

module.exports = authenticateToken;
