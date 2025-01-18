const express = require('express');
const {
  RegistrarPlanoDeTreino,
  getPlanosDeTreinoPorDia,
  getTiposDeTreinoPorPlanoId,
  getExerciciosPorPlanoId,
  excluirPlanoDeTreino,
  getExerciciosPorTipo,
  getVideoPorExercicio,
} = require('../controllers/planoTreinoController');  // Importe a função do controlador


const authMiddleware = require('../middleware/authMiddleware');  // Middleware de autenticação
const router = express.Router();

// Rota para registrar um novo plano de treino
router.post('/criar-plano', authMiddleware, RegistrarPlanoDeTreino);
/* 
json esperado:
{
  "nome_plano": "Plano de Treino X",
  "dia_semana_id": 1,  // ID do dia da semana
  "tipos_de_treino": [
    {
      "tipo_de_treino_id": 1,  // ID do tipo de treino (ex.: Cardio, Bíceps)
      "exercicios": [
        {
          "exercicio_id": 1,  // ID do exercício
          "duracao": 30  // Duração do exercício em minutos
        },
        {
          "exercicio_id": 2,
          "duracao": 40
        }
      ]
    },
    {
      "tipo_de_treino_id": 2,
      "exercicios": [
        {
          "exercicio_id": 3,
          "duracao": 45
        }
      ]
    }
  ]
}
*/


router.get('/planos-do-dia/:diaSemanaId', authMiddleware, getPlanosDeTreinoPorDia);

router.get('/tipos-de-treino-do-plano/:planoId', authMiddleware, getTiposDeTreinoPorPlanoId);

router.get('/exercicios-do-plano/:planoId', authMiddleware, getExerciciosPorPlanoId);



router.delete('/excluir-plano/:planoId', authMiddleware, excluirPlanoDeTreino);


/////////////////////////

router.get('/exercicios/:tipoExercicio', getExerciciosPorTipo);


router.get('/exercicios/videos/:exercicioId', getVideoPorExercicio);
// Exporta as rotas para o arquivo principal
module.exports = router;