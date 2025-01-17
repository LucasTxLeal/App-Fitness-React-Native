const { DataTypes } = require('sequelize');
const db = require('../DB/db');

const PerformanceLogs = db.define('PerformanceLogs', {
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
  PesoLevantado: {
    type: DataTypes.FLOAT,
    allowNull: false,
    field: 'pesolevantado',
  },//REMOVER REPETIÇOES AQUI E NO BANCO
  Repeticoes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'repeticoes',
  },
  Observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'observacoes',
  },
}, {
  tableName: 'performancelogs',
  timestamps: false,
});

// Função para criar log de performance
PerformanceLogs.createLog = async function (contaId, logData) {
  const { data, pesoLevantado, repeticoes, observacoes } = logData;
  return await PerformanceLogs.create({
    ContaId: contaId,
    Data: data,
    PesoLevantado: pesoLevantado,
    Repeticoes: repeticoes,
    Observacoes: observacoes,
  });
};

module.exports = PerformanceLogs;
