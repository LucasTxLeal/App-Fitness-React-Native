const { DataTypes } = require('sequelize');
const db = require('../DB/db');
const Contas = require('./ContaModel');
const DiasDaSemana = require('./DiasDaSemanaModel');

const PlanosDeTreino = db.define('PlanosDeTreino', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id', 
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'nome',
  },
  contaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contas',
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'contaid',
  },
  criadoPorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contas',
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'criadoporid',
  },
  dataCriacao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'datacriacao',
  },
  diaSemanaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'diassemana',
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'diasemanaid',
  },
}, {
  tableName: 'planosdetreino',
  timestamps: false,
});

PlanosDeTreino.belongsTo(Contas, { foreignKey: 'contaId', as: 'conta' });
PlanosDeTreino.belongsTo(Contas, { foreignKey: 'criadoPorId', as: 'criador' });
PlanosDeTreino.belongsTo(DiasDaSemana, { foreignKey: 'diaSemanaId', as: 'diaSemana' });

module.exports = PlanosDeTreino;
