const { Sequelize } = require('sequelize');

// Configurações do banco de dados
const sequelize = new Sequelize('samarin_db', 'root', 'everton427', {
    host: 'localhost', 
    dialect: 'mysql',
    logging: console.log, 
    define: {
        timestamps: true, // Adiciona createdAt e updatedAt
        underscored: true, // Usa snake_case para os nomes das colunas
    },
    pool: {
        max: 5, // Número máximo de conexões no pool
        min: 0, // Número mínimo de conexões no pool
        acquire: 30000, // Tempo máximo em milissegundos que o pool tentará adquirir uma conexão
        idle: 10000 // Tempo máximo em milissegundos que uma conexão pode ficar ociosa antes de ser liberada
    }
});
const Match = require('../models/matchs')(sequelize, Sequelize.DataTypes);
sequelize.models.Match = Match;

// Testar a conexão com o banco de dados
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados foi bem-sucedida!');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    }
}
const User = require('../models/user')(sequelize, Sequelize.DataTypes);
sequelize.models.User = User;


Match.associate = (models) => {
  Match.belongsTo(models.User, { foreignKey: 'matcher_id', as: 'matcher' });
  Match.belongsTo(models.User, { foreignKey: 'matchee_id', as: 'matchee' });
};

testConnection();

module.exports = sequelize;
