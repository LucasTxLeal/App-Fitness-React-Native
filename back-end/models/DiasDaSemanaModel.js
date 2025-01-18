const { DataTypes } = require('sequelize');
const db = require('../DB/db');

const DiasDaSemana = db.define('DiasDaSemana', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id', 
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'nome', // Nome da coluna no banco de dados
  },
}, {
  tableName: 'diasdasemana', // Nome da tabela no banco de dados
  timestamps: false, // Desabilita os timestamps automáticos
});

module.exports = DiasDaSemana;