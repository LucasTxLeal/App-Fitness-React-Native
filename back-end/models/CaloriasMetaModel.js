const { DataTypes } = require('sequelize');
const db = require('../DB/db');

const CaloriasMeta = db.define('CaloriasMeta', {
  ContaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contas',  // Nome da tabela que é referenciada
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'contaid',  // Nome da coluna no banco de dados
  },
  meta_calorias: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
    field: 'meta_calorias',  // Nome da coluna no banco de dados
  },
  data_registro: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: 'unique_user_date',
    field: 'data_registro',  // Nome da coluna no banco de dados
  },
}, {
  tableName: 'calorias_meta',  // Nome da tabela
  timestamps: false,
});

// Se precisar de alguma função customizada, como no seu exemplo de Progress, você pode adicionar aqui

module.exports = CaloriasMeta;
