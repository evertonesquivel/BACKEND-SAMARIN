// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const secretKey = 'seuSegredo';

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };
  
module.exports = authenticateToken;
