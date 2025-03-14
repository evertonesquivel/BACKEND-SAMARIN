// src/controllers/authController.js
const db = require('../db/connection'); // Certifique-se de que está importando sua conexão com o banco de dados
const jwt = require('jsonwebtoken');
const secretKey = ''; // A mesma chave que você usou para assinar o token


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

        const accessToken = jwt.sign({ id: user[0].id, email: user[0].email }, secretKey, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user[0].id }, secretKey, { expiresIn: '7d' });

        // Calcula a data de expiração para o refresh token
        const refreshTokenExpiration = new Date();
        refreshTokenExpiration.setDate(refreshTokenExpiration.getDate() + 7); // Expira em 7 dias

        // Armazene o refresh token no banco de dados com expires_at
        await db.query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)', 
                       [user[0].id, refreshToken, refreshTokenExpiration]);

        res.json({
            accessToken,
            refreshToken,
            userId: user[0].id,
            message: 'Login bem-sucedido'
        });
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).json({ message: 'Erro ao realizar login', error: error.message });
    }
};
// Função para renovar o token de acesso usando o refresh token
const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.sendStatus(401); // Se não houver refresh token, retorna 401

    try {
        const query = 'SELECT * FROM refresh_tokens WHERE token = ?';
        const [tokenRecord] = await db.query(query, [refreshToken]);

        if (!tokenRecord || tokenRecord.length === 0) {
            return res.sendStatus(403); // Se o refresh token não for encontrado, retorna 403
        }

        // Verifica o refresh token
        jwt.verify(refreshToken, secretKey, (err, user) => {
            if (err) return res.sendStatus(403); // Se o token não for válido, retorna 403

            // Gera um novo token de acesso
            const newAccessToken = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '15m' });

            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error('Erro ao renovar token de acesso:', error);
        res.status(500).json({ message: 'Erro ao renovar token de acesso', error: error.message });
    }
   
};
//func de atualizar a localização 

  const updateLocation = async (req, res) => {
    const { userId, latitude, longitude } = req.body;
    try {
        const query = 'UPDATE locations SET latitude = ?, longitude = ? WHERE id = ?';
        await db.query(query, [latitude, longitude, userId]);
        res.status(200).json({ message: 'Localização atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar localização:', error);
        res.status(500).json({ message: 'Erro ao atualizar localização', error: error.message });
    }
};

// Função de logout
const logout = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.sendStatus(401); // Se não houver refresh token, retorna 401

    try {
        await db.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
        res.status(204).send(); // Retorna 204 (No Content) para indicar sucesso
    } catch (error) {
        console.error('Erro ao realizar logout:', error);
        res.status(500).json({ message: 'Erro ao realizar logout', error: error.message });
    }
};

module.exports = {
    login,
    refreshAccessToken,
    updateLocation,
    logout,
};