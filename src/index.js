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




const sequelize = require('./db/dbSequelize'); // Importa o modelo User

async function syncDatabase() {
    try {
        await sequelize.sync({ force: false }); // force: true para recriar as tabelas
        console.log('Banco de dados sincronizado com sucesso!');
    } catch (error) {
        console.error('Erro ao sincronizar o banco de dados:', error);
    }
}

syncDatabase();
