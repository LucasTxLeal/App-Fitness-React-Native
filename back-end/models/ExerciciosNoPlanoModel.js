const { DataTypes } = require('sequelize');
const db = require('../DB/db');
const PlanosDeTreino = require('./PlanosDeTreinoModel');
const Exercicios = require('./ExerciciosModel');

const ExerciciosNoPlano = db.define('ExerciciosNoPlano', {
  
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id',  // Mantido como snake_case
  },
  plano_id: { // Nome da coluna em snake_case
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'planosdetreino',
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'planoid',  // Nome da coluna em snake_case
  },
  exercicio_id: { // Nome da coluna em snake_case
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'exercicios',
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'exercicioid',  // Nome da coluna em snake_case
  },
  duracao: { // Nome da coluna em snake_case
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'duracao',  // Nome da coluna em snake_case
  },
}, {
  tableName: 'exerciciosnoplano',  // Tabela em snake_case
  timestamps: false,
});

// Associações
ExerciciosNoPlano.belongsTo(PlanosDeTreino, { foreignKey: 'planoid', as: 'planosDeTreino' });
ExerciciosNoPlano.belongsTo(Exercicios, { foreignKey: 'exercicioid', as: 'exercicio' });
module.exports = ExerciciosNoPlano;