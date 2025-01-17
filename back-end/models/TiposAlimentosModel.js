const { DataTypes } = require('sequelize');
const db = require('../DB/db');

const TiposAlimentos = db.define('TiposAlimentos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tipo_nome: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'tipos_alimentos',
  timestamps: false,
});

module.exports = TiposAlimentos;
