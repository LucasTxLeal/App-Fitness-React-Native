const { DataTypes } = require('sequelize');
const db = require('../DB/db');
const Conta = require('./ContaModel');

const Usuario = db.define('Usuario', {
  contaid: {  // Usando o nome correto da coluna, em minúsculas
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contas', // Nome da tabela, em minúsculas
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'contaid',  // Nome da coluna no banco de dados
  },
  objetivo: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'objetivo', // Nome da coluna no banco de dados
  },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

Usuario.createUsuario = async function (contaId, objetivo) {
  try {
    const usuario = await Usuario.create({
      contaid: contaId,  // Referência à coluna com nome correto
      objetivo: objetivo,
    });
    return usuario;
  } catch (error) {
    console.error('Erro ao criar usuário:', error.message);
    throw new Error('Erro ao criar usuário');
  }
};

Usuario.belongsTo(Conta, { foreignKey: 'contaid', as: 'conta' });

module.exports = Usuario;