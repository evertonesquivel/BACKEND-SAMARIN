const express = require('express');
const app = express();
const cors = require('cors'); // Importe o pacote cors
const userRoutes = require('./routes/userRoutes');

//Configure o CORS
app.use(cors({
  origin: 'http://localhost:4200', // Permita apenas seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  credentials: true // Permitir cookies, caso necessário
}));
app.use(express.json());
app.use('/', userRoutes); // Prefixo para as rotas de usuários

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
