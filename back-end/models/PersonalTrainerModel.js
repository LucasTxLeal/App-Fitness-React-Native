const { DataTypes } = require('sequelize');
const db = require('../DB/db');
const conta = require('./ContaModel'); // Relacionamento com o modelo de conta

// Definindo o modelo de PersonalTrainer
const PersonalTrainer = db.define('PersonalTrainer', {
  contaid: {  
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contas', // Nome da tabela, em minúsculas
      key: 'id',
    },
    onDelete: 'CASCADE',
    field: 'contaid',  // Nome da coluna no banco de dados
  },
  especialidade: { 
    type: DataTypes.STRING(255), 
    field: 'especialidade' 
  },
  certificado: { 
    type: DataTypes.STRING(255), 
    field: 'certificado' 
  }
}, {
  tableName: 'personaltrainers', // Nome da tabela no banco
  timestamps: false, 
});

// Método estático para criar o PersonalTrainer
PersonalTrainer.createPersonalTrainer = async function(contaId, especialidade, certificado) {
  try {
    const personalTrainer = await PersonalTrainer.create({
      contaid: contaId,  // Relaciona com a conta criada
      especialidade: especialidade, // Define a especialidade
      certificado: certificado,     // Define o certificado
    });
    return personalTrainer;
  } catch (error) {
    console.error('Erro ao criar personal trainer:', error.message);
    throw new Error('Erro ao criar personal trainer');
  }
};


module.exports = PersonalTrainer;
