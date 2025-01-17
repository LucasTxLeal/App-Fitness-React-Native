const { DataTypes } = require('sequelize');
const db = require('../DB/db');

const Progresso = db.define('Progresso', {
  ContaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contas',
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'contaid',
  },
  Data: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'data',
  },
  PesoAtual: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'pesoatual',
  },
  IMC: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'imc',
  },
  Performance: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'performance',
  },
  
}, {
  tableName: 'progresso',
  timestamps: false,
});

// Função para criar um registro de progresso
Progresso.createProgresso = async function (contaId, progressData) {
  const { data, pesoAtual, imc, performance} = progressData;
  return await Progresso.create({
    ContaId: contaId,
    Data: data,
    PesoAtual: pesoAtual,
    IMC: imc,
    Performance: performance,
  });
};

module.exports = Progresso;
