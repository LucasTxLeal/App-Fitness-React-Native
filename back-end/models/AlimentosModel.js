const { DataTypes } = require('sequelize');
const db = require('../DB/db');

const Alimentos = db.define('Alimentos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id',  // Nome da coluna no banco de dados
  },
  nome_alimento: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nome_alimento',  // Nome da coluna no banco de dados
  },
  tipo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tipos_alimentos',  // Nome da tabela referenciada
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'tipo_id',  // Nome da coluna no banco de dados
  },
  calorias: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
    field: 'calorias',  // Nome da coluna no banco de dados
  },
  proteinas: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
    field: 'proteinas',  // Nome da coluna no banco de dados
  },
  gorduras: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
    field: 'gorduras',  // Nome da coluna no banco de dados
  },
}, {
  tableName: 'alimentos',  // Nome da tabela no banco de dados
  timestamps: false,
});

module.exports = Alimentos;
