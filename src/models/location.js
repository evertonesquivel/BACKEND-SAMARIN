const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db/dbSequelize'); 

const Location = sequelize.define('Location', {
  id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
  },
  city: {
      type: Sequelize.STRING,
      allowNull: false
  },
  state: {
      type: Sequelize.STRING,
      allowNull: false
  },
  country: {
      type: Sequelize.STRING,
      allowNull: false
  },
  latitude: {
      type: Sequelize.FLOAT,
      allowNull: false
  },
  longitude: {
      type: Sequelize.FLOAT,
      allowNull: false
  },
  users_id: {
      type: Sequelize.BIGINT,
      allowNull: false
  }
}, {
  tableName: 'locations',
  timestamps: true, // Ativa a criação automática das colunas created_at e updated_at
  createdAt: 'created_at', // Nome da coluna no banco de dados
  updatedAt: 'updated_at'   // Nome da coluna no banco de dados
});


module.exports = Location; 
