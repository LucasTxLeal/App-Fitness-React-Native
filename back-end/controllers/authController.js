
const Usuario = require('../models/UsuariosModel'); // Caminho correto para o modelo User
const Personal= require('../models/PersonalTrainerModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Conta = require('../models/ContaModel');
require('dotenv').config();

// Registro de Usuário
const registroUsuario = async (req, res) => {
  const { nome, email, senha, datadenascimento, peso, altura} = req.body;
  console.log (req.body)

  try {
    // Criptografar senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar conta
    const conta = await Conta.createConta(nome, email, hashedPassword, 'Usuario', datadenascimento, peso, altura);

    // Criar usuário
    const usuario = await Usuario.createUsuario(conta.id, req.body.objetivo);  // Chamada de createUser

    res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      conta,
      usuario,
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

// Registro de Personal Trainer
const registroPersonalTrainer = async (req, res) => {
  const { nome, email, senha, datadenascimento, peso, altura} = req.body;

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    
    // Criar conta
    const conta = await Conta.createConta(nome, email, hashedPassword, 'PersonalTrainer', datadenascimento, peso, altura);

    const personal = await Personal.createPersonalTrainer(conta.id, req.body.especialidade, req.body.certificado);

    res.status(201).json({
      message: 'Personal Trainer registrado com sucesso!',
      conta,
      personal,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar personal trainer.' });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verificar se o e-mail existe
    const conta = await Conta.findOne({ where: { Email: email } });
    if (!conta) {
      return res.status(404).json({ error: 'E-mail não encontrado.' });
    }

    // Verificar se a senha está correta
    const isPasswordValid = await bcrypt.compare(senha, conta.Senha);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha inválida.' });
    }

    // Gerar um token JWT
    const token = jwt.sign(
      { id: conta.id, email: conta.Email, type: conta.Tipo },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } 
    );

    // Retornar o token e os dados do usuário
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
      user: {
        id: conta.id,
        name: conta.Nome,
        email: conta.Email,
        type: conta.Tipo,
        altura: conta.Altura,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error.message);
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
};

module.exports = { registroUsuario, registroPersonalTrainer, login };
