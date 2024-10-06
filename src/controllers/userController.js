const pool = require('../db/connection'); // Ajuste para o arquivo correto de conexão com o BD

// Função para listar todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Users'); // Consulta ao BD para listar os usuários
    res.status(200).json(rows); // Retorna os usuários em formato JSON
  } catch (error) {
    res.status(500).json({ error: error.message }); // Retorna o erro caso haja falha
  }
};
