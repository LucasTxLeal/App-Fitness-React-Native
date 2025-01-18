const { DataTypes } = require('sequelize');
const db = require('../DB/db');
const TipoDeTreinos = require('./TipoDeTreinosModel');

const Exercicios = db.define('Exercicios', {

  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'nome', 
  },

  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descricao', 
  },

  tipoDeTreinoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
    field: 'tipodetreinoid', 
  },
  musculoAlvo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'musculoalvo', 
  },
}, {
  tableName: 'exercicios', 
  timestamps: false, 
});


Exercicios.belongsTo(TipoDeTreinos, { foreignKey: 'tipoDeTreinoId', as: 'tipoDeTreino' });

module.exports = Exercicios;