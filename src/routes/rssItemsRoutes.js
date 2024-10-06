const express = require('express');
const router = express.Router(); // Usando o Router do Express

// Definindo a rota para obter usuários
router.get('/users', (req, res) => {
  // Aqui você pode adicionar a lógica para consultar o banco de dados
  res.send('Aqui estão os usuários'); // Placeholder para a resposta
});

// Exportando o Router
module.exports = router;
