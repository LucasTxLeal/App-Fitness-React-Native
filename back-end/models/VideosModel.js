// VideosModel.js
const { DataTypes } = require('sequelize');
const db = require('../DB/db');
const Exercicios = require('./ExerciciosModel'); 


const Videos = db.define('Videos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  exercicioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'exercicios',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'videos',
  timestamps: false,
});

Videos.belongsTo(Exercicios, { foreignKey: 'exercicioId', as: 'exercicio' });

module.exports = Videos;