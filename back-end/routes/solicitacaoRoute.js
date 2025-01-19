const express = require('express');
const { 
  listarPersonalTrainers, 
  criarSolicitacaoDePlano, 
  listarSolicitacoesPendentes,
  responderSolicitacao,
  recusarSolicitacao 
} = require('../controllers/solicitacaoController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rota para listar todos os personal trainers e suas informações
router.get('/personal-trainers', listarPersonalTrainers);
/* 
Exemplo de resposta esperada:
[
  {
    "id": 1,
    "especialidade": "Musculação",
    "certificado": "Certificado Internacional",
    "usuario": {
      "id": 2,
      "nome": "João Silva",
      "peso": 80,
      "altura": 1.75
    }
  },
  ...
]
*/

// Rota para criar uma solicitação de plano de treino
router.post('/criar-solicitacao', authMiddleware, criarSolicitacaoDePlano);
/* 
JSON esperado no corpo da requisição:
{
  "personal_id": 1,
  "objetivo": "Ganhar massa muscular",
  "descricao": "Quero um plano focado em hipertrofia e fortalecimento muscular."
}

Exemplo de resposta esperada:
{
  "message": "Solicitação de plano de treino criada com sucesso!",
  "solicitacao": {
    "id": 1,
    "usuario_id": 5,
    "personal_id": 1,
    "objetivo": "Ganhar massa muscular",
    "descricao": "Quero um plano focado em hipertrofia e fortalecimento muscular.",
    "estado": "Pendente",
    "data_criacao": "2025-01-11T14:00:00.000Z"
  }
}
*/

// Rota para listar solicitações pendentes para o personal trainer autenticado
router.get('/pendentes', authMiddleware, listarSolicitacoesPendentes);
/* 
Exemplo de resposta esperada:
[
  {
    "id": 1,
    "usuario_id": 5,
    "objetivo": "Ganhar massa muscular",
    "descricao": "Quero um plano focado em hipertrofia e fortalecimento muscular.",
    "estado": "Pendente",
    "data_criacao": "2025-01-11T14:00:00.000Z",
    "usuario": {
      "id": 5,
      "nome": "Carlos Souza",
      "peso": 70,
      "altura": 1.68
    }
  },
  ...
]
*/


router.post('/responder/:solicitacaoId', authMiddleware, responderSolicitacao);

router.put('/recusar/:solicitacaoId', authMiddleware, recusarSolicitacao);

module.exports = router;
