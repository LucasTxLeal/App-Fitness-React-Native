const { DataTypes } = require('sequelize');
const db = require('../DB/db');

// Definindo o modelo da conta
const Conta = db.define('Conta', {
  Nome: { 
    type: DataTypes.STRING(255), 
    allowNull: false, 
    field: 'nome'  // Mapeando o campo 'Nome' para 'nome' no banco de dados
  },
  Email: { 
    type: DataTypes.STRING(255), 
    allowNull: false, 
    unique: true, 
    field: 'email' // Mapeando o campo 'Email' para 'email' no banco de dados
  },
  Senha: { 
    type: DataTypes.STRING(255), 
    allowNull: false, 
    field: 'senha' // Mapeando o campo 'Senha' para 'senha' no banco de dados
  },
  Tipo: {
    type: DataTypes.ENUM('Usuario', 'PersonalTrainer'),
    allowNull: false,
    field: 'tipo' // Mapeando o campo 'Tipo' para 'tipo' no banco de dados
  },
  DataDeNascimento: { 
    type: DataTypes.DATEONLY, 
    allowNull: false, 
    field: 'datadenascimento' // Mapeando o campo 'DataDeNascimento' para 'data_de_nascimento' no banco de dados
  },
  Peso: { 
    type: DataTypes.FLOAT, 
    allowNull: false, 
    field: 'peso' // Mapeando o campo 'Peso' para 'peso' no banco de dados
  },
  Altura: { 
    type: DataTypes.FLOAT, 
    allowNull: false, 
    field: 'altura' // Mapeando o campo 'Altura' para 'altura' no banco de dados
  },
  DataDeCriacao: { 
    type: DataTypes.DATE, 
    allowNull: false, 
    defaultValue: DataTypes.NOW, 
    field: 'datadecriacao' // Mapeando o campo 'DataDeCriacao' para 'data_de_criacao' no banco de dados
  },
}, {
  tableName: 'contas', // Nome da tabela no banco
  timestamps: false, // O Sequelize irá gerenciar as colunas createdAt e updatedAt
});

// Função estática para criar uma conta
Conta.createConta = async function (nome, email, senha, tipo, datadenascimento, peso, altura) {
  try {
    const conta = await Conta.create({
      Nome: nome,
      Email: email,
      Senha: senha,
      Tipo: tipo,
      DataDeNascimento: datadenascimento,
      Peso:peso,
      Altura: altura,
    });
    return conta; // Retorna o objeto da conta criada (com o id gerado automaticamente)
  } catch (error) {
    console.error('Erro ao criar conta:', error.message);
    throw new Error('Erro ao criar conta');
  }
};



module.exports = Conta;