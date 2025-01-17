const { Sequelize } = require('sequelize');
require('dotenv').config();

// Criação da instância do Sequelize utilizando o pool do `pg`
const sequelize = new Sequelize({
  dialect: 'postgres',  // Especifica o tipo de banco
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  pool: {
    max: 5,    // Máximo de conexões no pool
    min: 0,    // Mínimo de conexões no pool
    acquire: 30000, // Tempo máximo de conexão em ms
    idle: 10000,   // Tempo máximo sem uso antes de fechar a conexão
  },
});

module.exports = sequelize;
