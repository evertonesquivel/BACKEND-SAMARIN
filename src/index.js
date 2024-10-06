const express = require('express');
const app = express();
const port = 3000;

// Middleware para permitir o parse de JSON no corpo da requisição
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
  res.send('A API está funcionando');
});

// Importa as rotas de usuários
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes); // A rota '/users' utilizará as rotas definidas no arquivo userRoutes.js

// Inicia o servidor
app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
