const { DataTypes } = require('sequelize');
const db = require('../DB/db');
const Alimentos = require('./AlimentosModel'); // Import do modelo Alimentos
const tiposAlimentos = require('./TiposAlimentosModel'); // Import do modelo TiposDeRefeicao

const Refeicoes = db.define('Refeicoes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id', // Nome da coluna no banco de dados
  },
  contaid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contas', // Nome da tabela referenciada
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'contaid', // Nome da coluna no banco de dados
  },
  
  data_registro: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'data_registro', // Nome da coluna no banco de dados
  },
  tipo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tipos_de_refeicao', // Nome da tabela referenciada
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'tipo_id', // Nome da coluna no banco de dados
  },
  alimento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'alimentos', // Nome da tabela referenciada
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'alimento_id', // Nome da coluna no banco de dados
  },
  quantidade_gramas: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0.1],
        msg: 'Quantidade em gramas deve ser maior ou igual a 0.1.',
      },
      notNull: {
        msg: 'Quantidade em gramas é obrigatória.',
      },
    },
    field: 'quantidade_gramas', 
  },
}, {
  tableName: 'refeicoes', 
  timestamps: false,
});

// Definir associações
Refeicoes.belongsTo(Alimentos, { foreignKey: 'alimento_id', as: 'alimento' });
Refeicoes.belongsTo(tiposAlimentos, { foreignKey: 'tipo_id', as: 'tipo' });

module.exports = Refeicoes;
