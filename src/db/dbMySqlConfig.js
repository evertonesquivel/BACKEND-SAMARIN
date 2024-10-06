const mysql = require('mysql2/promise');

const dbMySqlConfig = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'samarin_db',
  password: 'minhasenha',
  port: 3306 // Porta padrão do MySQL
});

module.exports = dbMySqlConfig;


