const { DataTypes } = require('sequelize');
const sequelize = require('../db/dbSequelize'); // ajuste o caminho conforme sua estrutura de pastas

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  images: {
    type: DataTypes.JSON, // Usado para armazenar um array de strings
    allowNull: false,
  },
  infos: {
    type: DataTypes.JSON, // Usado para armazenar um array de strings
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  identification: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  interest: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ageRange: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specificInterests: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  locationId: {
    type: DataTypes.INTEGER, // Ajuste o tipo conforme necessário
    allowNull: false,
    references: {
      model: 'Locations', // Nome da tabela referenciada
      key: 'id', // Chave primária da tabela referenciada
    },
  },
  pronouns: { // Novo campo para pronomes
    type: DataTypes.STRING,
    allowNull: true, // Ajuste conforme sua necessidade
  },
  sexualOrientation: { // Novo campo para orientação sexual
    type: DataTypes.STRING,
    allowNull: true, // Ajuste conforme sua necessidade
  },
  genderIdentity: { // Novo campo para identidade de gênero
    type: DataTypes.STRING,
    allowNull: true, // Ajuste conforme sua necessidade
  },
  personality: { // Novo campo para personalidade
    type: DataTypes.STRING,
    allowNull: true, // Ajuste conforme sua necessidade
  },
  hobbies: { // Novo campo para hobbies
    type: DataTypes.STRING,
    allowNull: true, // Ajuste conforme sua necessidade
  },
  min_age_interest: { // Novo campo para idade mínima de interesse
    type: DataTypes.INTEGER,
    allowNull: true, // Ajuste conforme sua necessidade
  },
  max_age_interest: { // Novo campo para idade máxima de interesse
    type: DataTypes.INTEGER,
    allowNull: true, // Ajuste conforme sua necessidade
  },
}, {
  tableName: 'users', // Nome da tabela no banco de dados
  timestamps: true, // Habilitar createdAt e updatedAt
});

module.exports = User;
