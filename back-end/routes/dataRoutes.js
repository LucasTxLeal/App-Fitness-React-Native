const express = require('express');
const { 
  createProgressoRegistro,
  getProgresso,
  deleteProgresso,
  updateProgresso,
  createPerformanceLog,
  getPerformanceLogs,
  deletePerformanceLog,
  updatePerformanceLog,
} = require('../controllers/dataController');

const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Rotas protegidas relacionadas aos dados do usuário
router.post('/progress', authMiddleware, createProgressoRegistro);
/* 
json esperado
{
  "data": "2025-01-12",
  "pesoAtual": 100.5,
  "imc": 66.6,
  "performance": "FACIL",
  "treinosConcluidos": 66
}


*/

router.post('/performance-logs', authMiddleware, createPerformanceLog);
/* 
{
  "data": "2025-01-12",
  "pesoLevantado": 50,
  "repeticoes": 10,
  "observacoes": "testanto"
}

*/

// Rotas para visualização dos dados do usuário
router.get('/progress', authMiddleware, getProgresso);  // Rota para visualização de progresso
/* 
rota
http://localhost:3000/api/data/performance-logs


*/

router.get('/performance-logs', authMiddleware, getPerformanceLogs);  // Rota para visualização dos logs de performance
/* 
rota
http://localhost:3000/api/data/performance-logs

*/

// Rotas para exclusao de registros do usuário
router.delete('/progress/:id', authMiddleware, deleteProgresso);
/* 
rota com id que se deseja apagar
http://localhost:3000/api/data/progress/12


*/

router.delete('/performance-logs/:id', authMiddleware, deletePerformanceLog);
/* 

http://localhost:3000/api/data/performance-logs/7(id que deseja-se apagar)

*/


// Rotas para edição de registros do usuário
router.put('/progress/:id', authMiddleware, updateProgresso);
/* 
{
  "performance": "LEGAL"

}


*/

router.put('/performance-logs/:id', authMiddleware, updatePerformanceLog);
/* 
{
  "pesoLevantado": 8000,
  "repeticoes": 10000000,
  "observacoes": "É MAIS DE 8000"
}


*/

module.exports = router;
