const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const rssItemsRoutes = require('./routes/rssItemsRoutes'); // Importando as rotas

dotenv.config();

const app = express();
app.use(express.json());

// Configuração da conexão com o MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Conectando ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Usar as rotas
app.use(rssItemsRoutes); // Isso remove o prefixo '/api' Usando as rotas que você criou

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

// Definindo a porta do servidor
const PORT = process.env.PORT || 3000;

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
