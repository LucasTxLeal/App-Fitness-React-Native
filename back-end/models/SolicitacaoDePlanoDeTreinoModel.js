const { DataTypes } = require('sequelize');
const db = require('../DB/db');
const Usuario = require('./UsuariosModel'); // Modelo de usuários
const PersonalTrainer = require('./PersonalTrainerModel'); // Modelo de personal trainers
const DiasDaSemana = require('./DiasDaSemanaModel'); // Modelo de dias da semana

const SolicitacaoDePlanoDeTreino = db.define('SolicitacaoDePlanoDeTreino', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id',
  },
  usuarioId: { // ID do solicitante (usuário)
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id', // Referência ao ID único da tabela `usuarios`
    },
    onDelete: 'CASCADE',
    field: 'usuario_id',
  },
  personalId: { // ID do solicitado (personal trainer)
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PersonalTrainer,
      key: 'id', // Referência ao ID único da tabela `personaltrainers`
    },
    onDelete: 'CASCADE',
    field: 'personal_id',
  },
  diaSemanaId: { // ID do dia da semana
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: DiasDaSemana,
      key: 'id', // Referência ao ID único da tabela `diasdasemana`
    },
    onDelete: 'CASCADE',
    field: 'dia_semana_id',
  },
  objetivo: { // Objetivo do solicitante
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'objetivo',
  },
  descricao: { // Descrição textual feita pelo solicitante
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'descricao',
  },
  estado: { // Estado da solicitação
    type: DataTypes.ENUM('Concluida', 'Pendente', 'Cancelada'),
    allowNull: false,
    defaultValue: 'Pendente', // Valor padrão
    field: 'estado',
  },
  dataCriacao: { // Data de criação da solicitação
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'data_criacao',
  },
}, {
  tableName: 'solicitacaodeplanodetreino',
  timestamps: false,
});

// Associações
SolicitacaoDePlanoDeTreino.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
SolicitacaoDePlanoDeTreino.belongsTo(PersonalTrainer, { foreignKey: 'personalId', as: 'personalTrainer' });
SolicitacaoDePlanoDeTreino.belongsTo(DiasDaSemana, { foreignKey: 'diaSemanaId', as: 'diaSemana' }); // Associação com DiasDaSemana

module.exports = SolicitacaoDePlanoDeTreino;
