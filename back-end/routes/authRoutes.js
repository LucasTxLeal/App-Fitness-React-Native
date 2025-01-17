const express = require('express');

const { 
  registroUsuario, 
  registroPersonalTrainer, 
  login 
} = require('../controllers/authController');

const router = express.Router();

// Rotas públicas
router.post('/registro/usuario', registroUsuario);
/* 
json esperado
{
  "nome": "testeUSUARIO",
  "email": "testeUSUARIOo@example.com",
  "senha": "senha123",
  "datadenascimento": "2001-07-22",
  "peso": 80,
  "altura": 1.77,
  "objetivo": "testeUSUARIO"
}

*/


router.post('/registro/personal', registroPersonalTrainer);
/* 
json esperado
{
  "nome": "testaoPERSONAL",
  "email": "testaoPERSONAL@example.com",
  "senha": "senha123",
  "datadenascimento": "2001-10-11",
  "peso": 16,
  "altura": 3.0,
  "especialidade": "testaoPERSONAL",
	"certificado":"testaoPERSONAL"
}

*/


router.post('/login', login);
/* 
json esperado
{
  "email": "LucasPersonal@example.com",
  "password": "senha123"
}

*/


module.exports = router;