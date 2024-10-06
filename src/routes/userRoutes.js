const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para listar todos os usuários
router.get('/', userController.getAllUsers);

module.exports = router;
