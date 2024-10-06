const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',       // ou o endereço do seu servidor MySQL
  user: 'root',
  password: 'everton427',
  database: 'samarin_db'
});

module.exports = pool;



