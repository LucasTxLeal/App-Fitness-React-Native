const { DataTypes } = require('sequelize');
const db = require('../DB/db');
const PlanosDeTreino = require('./PlanosDeTreinoModel');
const TipoDeTreinos = require('./TipoDeTreinosModel');

const TiposDeTreinoNoPlano = db.define('TiposDeTreinoNoPlano', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id', 
  },
  planoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'planosdetreino', 
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'planoid', 
  },
  tipoDeTreinoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tipodetreinos', 
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'tipodetreinoid', 
  },
}, {
  tableName: 'tiposdetreinonoplano', 
  timestamps: false, 
});

// Definir associações
TiposDeTreinoNoPlano.belongsTo(PlanosDeTreino, { foreignKey: 'planoId', as: 'planosDeTreino' });
TiposDeTreinoNoPlano.belongsTo(TipoDeTreinos, { foreignKey: 'tipoDeTreinoId', as: 'tipoDeTreino' });

module.exports = TiposDeTreinoNoPlano;