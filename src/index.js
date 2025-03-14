const express = require('express');
const http = require('http'); // Importar http para permitir WebSocket
const cors = require('cors');
const bodyParser = require('body-parser');
const socketIo = require('socket.io'); // Importar o socket.io
const sequelize = require('./db/dbSequelize'); // Instância do Sequelize
const app = express();

// Configure o CORS
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Aumentar o limite de tamanho do payload para 50 MB (ou o tamanho que você precisar)
app.use(bodyParser.json({ limit: '50mb' })); // Configuração para JSON
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Configuração para URL-encoded

// Usar as rotas de autenticação
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/login', authRoutes);
app.use('/', userRoutes); // Prefixo para as rotas de usuários

// Criar o servidor HTTP
const server = http.createServer(app);

// Inicializar o WebSocket com o servidor
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200', // URL do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Inicializar WebSocket no controlador
const chatController = require('./controllers/chatController');
chatController.initializeWebSocket(io);

// Sincronizar o banco de dados
async function syncDatabase() {
    try {
        // Adicione aqui todos os modelos manualmente para sincronizar, se necessário
        await sequelize.sync({ force: false }); // force: true para recriar as tabelas
        console.log('Banco de dados sincronizado com sucesso!');
    } catch (error) {
        console.error('Erro ao sincronizar o banco de dados:', error);
    }
}
syncDatabase();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});