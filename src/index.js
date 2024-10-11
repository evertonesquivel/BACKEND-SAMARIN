const express = require('express');
const app = express();
const cors = require('cors'); // Importe o pacote cors
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');


//Configure o CORS
app.use(cors({
  origin: 'http://localhost:4200', // Permita apenas seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  credentials: true // Permitir cookies, caso necessário
}));
app.use(express.json());
// Middleware para lidar com JSON no corpo da requisição
app.use(bodyParser.json());

// Usar as rotas de autenticação
app.use('/login', authRoutes);

app.use('/', userRoutes); // Prefixo para as rotas de usuários

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
