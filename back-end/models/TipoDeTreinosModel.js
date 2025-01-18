const { DataTypes } = require('sequelize');
const db = require('../DB/db');

const TipoDeTreinos = db.define('TipoDeTreinos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id', 
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    field: 'nome', // Nome da coluna no banco de dados
  },
}, {
  tableName: 'tipodetreinos', // Nome da tabela no banco de dados
  timestamps: false, // Desabilita os timestamps automáticos
});

module.exports = TipoDeTreinos;