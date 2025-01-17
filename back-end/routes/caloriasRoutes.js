const express = require('express');
const {
  MetaCaloria,
  RegistrarConsumo,
  EditarConsumo,
  ExcluirConsumo,
  VerResumoDiario,
  ObterAlimentosPorTipo,
  ObterRefeicoesPorUsuario, 
} = require('../controllers/caloriasController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rotas para metas de calorias
router.post('/meta-calorias', authMiddleware, MetaCaloria); // Definir meta de calorias
/*
{
  "meta_calorias": 10000,
  "data_registro": "2025-01-14"
}
*/

router.post('/comeu', authMiddleware, RegistrarConsumo); // Registrar consumo
/*
{

  "data_registro": "2025-01-15",
  "tipo_id": 1,
  "alimento_id": 1,
  "quantidade_gramas": 222
}

*/
// Rotas para registros de consumo

router.put('/comeu/:id', authMiddleware, EditarConsumo);// Editar consumo
/*
{
  "quantidade_gramas": 5555.66
}

*/
router.delete('/remover/:id', authMiddleware, ExcluirConsumo); // Excluir consumo
/*
http://localhost:3000/api/refeicoes/remover/6

*/


// Nova rota para obter alimentos por tipo de refeição
router.get('/alimentos/tipo_refeicao/:tipo_refeicao', ObterAlimentosPorTipo);
/*
{

rota:http://localhost:3000/api/refeicoes/alimentos/tipo_refeicao/2
}

*/
// Nova rota para obter todas as refeições de um usuário
router.get('/consumido/:data_registro', authMiddleware, ObterRefeicoesPorUsuario);

router.get('/resumo-diario', authMiddleware, VerResumoDiario); // Ver resumo diário de calorias e nutrientes
/*
http://localhost:3000/api/refeicoes/resumo-diario?data_registro=2025-01-15

*/

module.exports = router;
