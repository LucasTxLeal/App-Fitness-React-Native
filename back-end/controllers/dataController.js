const Progresso = require('../models/ProgressoModel');
const PerformanceLogs = require('../models/PerformanceLogsModel');





/*===========================================================================================================================================*/
/*===========================================================================================================================================*/
/*===========================================================================================================================================*/

// Criar progresso
const createProgressoRegistro = async (req, res) => {
  try {
    const progresso = await Progresso.createProgresso(req.user.id, req.body);
    res.status(201).json({ message: 'Progresso registrado com sucesso!', progresso });
  } catch (error) {
    console.error('Erro ao criar progresso:', error.message);
    res.status(500).json({ error: 'Erro ao criar progresso' });
  }
};

//pegar registros de progresso do usuario autenticado 
const getProgresso = async (req, res) => {
  try {
    // Buscar os registros de progresso associados ao AccountId do usuário autenticado
    const progresso = await Progresso.findAll({
      where: { ContaId: req.user.id }, // Garantir que o AccountId seja do usuário autenticado
      order: [['Data', 'DESC']],  // Ordenar por data, mais recente primeiro
    });

    res.status(200).json(progresso);
  } catch (error) {
    console.error('Erro ao buscar progresso:', error.message);
    res.status(500).json({ error: 'Erro ao buscar progresso' });
  }
};
//deleta registro  de progresso do usuario autenticado 
const deleteProgresso = async (req, res) => {
  try {
      const { id } = req.params; // ID do progresso a ser excluído
      const usuarioId = req.user.id; // ID do usuário autenticado

      // Verificar se o ID é válido
      if (isNaN(id)) {
          return res.status(400).json({ message: 'ID inválido fornecido.' });
      }

      // Buscar o registro no banco
      const progresso = await Progresso.findByPk(id);

      if (!progresso) {
          return res.status(404).json({ message: 'Progresso não encontrado.' });
      }

      // Verificar se o progresso pertence ao usuário autenticado
      if (progresso.ContaId !== usuarioId) {
          return res.status(403).json({ message: 'Acesso negado. Você não pode excluir este progresso.' });
      }

      // Excluir o progresso
      await progresso.destroy();
      res.status(200).json({ message: 'Progresso excluído com sucesso!' });
  } catch (error) {
      res.status(500).json({
          message: 'Erro ao excluir progresso',
          error: error.message,
      });
  }
};

const updateProgresso = async (req, res) => {
  try {
    const { id } = req.params; // ID do progresso a ser atualizado
    const userId = req.user.id; // ID do usuário autenticado
    const { pesoAtual, imc, performance } = req.body; // Novos dados do progresso

    // Verificar se o ID é válido
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido fornecido.' });
    }

    // Buscar o registro no banco
    const progressoRecord = await Progresso.findByPk(id);

    if (!progressoRecord) {
      return res.status(404).json({ message: 'Progresso não encontrado.' });
    }

    // Verificar se o progresso pertence ao usuário autenticado
    if (progressoRecord.ContaId !== userId) {
      return res.status(403).json({ message: 'Acesso negado. Você não pode editar este progresso.' });
    }

    // Atualizar os dados
    progressoRecord.PesoAtual = pesoAtual || progressoRecord.PesoAtual;
    progressoRecord.IMC = imc || progressoRecord.IMC;
    progressoRecord.Performance = performance || progressoRecord.Performance;
    
    // Salvar as alterações
    await progressoRecord.save();

    res.status(200).json({ message: 'Progresso atualizado com sucesso!', progresso: progressoRecord });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao atualizar progresso',
      error: error.message,
    });
  }
};



/*===========================================================================================================================================*/
/*===========================================================================================================================================*/
/*===========================================================================================================================================*/

// Criar log de performance
const createPerformanceLog = async (req, res) => {
  try {
    const log = await PerformanceLogs.createLog(req.user.id, req.body);
    res.status(201).json({ message: 'Log de performance criado!', log });
  } catch (error) {
    console.error('Erro ao criar log de performance:', error.message);
    res.status(500).json({ error: 'Erro ao criar log de performance' });
  }
};
//Pegar registros de Performance do usuario autenticado 
const getPerformanceLogs = async (req, res) => {
  try {
    
    const logs = await PerformanceLogs.findAll({
      where: { ContaId: req.user.id },
      order: [['Data', 'DESC']],  // Ordenar por data, mais recente primeiro
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error('Erro ao buscar logs de performance:', error.message);
    res.status(500).json({ error: 'Erro ao buscar logs de performance' });
  }
};

const deletePerformanceLog = async (req, res) => {
  try {
    const { id } = req.params;  // ID do log a ser excluído
    const userId = req.user.id;  // ID do usuário autenticado

    // Verificar se o ID é válido
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido fornecido.' });
    }

    // Adicionando log de depuração para verificar o modelo
    console.log('PerformanceLogs:', PerformanceLogs);

    // Buscar o log de performance no banco
    const log = await PerformanceLogs.findByPk(id);  // Certificando-se de usar 'PerformanceLogs'

    if (!log) {
      return res.status(404).json({ message: 'Log de performance não encontrado.' });
    }

    // Verificar se o log pertence ao usuário autenticado
    if (log.ContaId !== userId) {
      return res.status(403).json({ message: 'Acesso negado. Você não pode excluir este log.' });
    }

    // Excluir o log
    await log.destroy();
    res.status(200).json({ message: 'Log de performance excluído com sucesso!' });

  } catch (error) {
    console.error(error); // Log para depuração
    res.status(500).json({
      message: 'Erro ao excluir log de performance',
      error: error.message,
    });
  }
};

const updatePerformanceLog = async (req, res) => {
  try {
      const { id } = req.params; // ID do log de performance a ser atualizado
      const userId = req.user.id; // ID do usuário autenticado
      const { pesoLevantado, repeticoes, observacoes } = req.body; // Novos dados do log de performance

      // Verificar se o ID é válido
      if (isNaN(id)) {
          return res.status(400).json({ message: 'ID inválido fornecido.' });
      }

      // Buscar o registro no banco
      const log = await PerformanceLogs.findByPk(id);

      if (!log) {
          return res.status(404).json({ message: 'Log de performance não encontrado.' });
      }

      // Verificar se o log pertence ao usuário autenticado
      if (log.ContaId !== userId) {
          return res.status(403).json({ message: 'Acesso negado. Você não pode editar este log.' });
      }

      // Atualizar os dados
      log.PesoLevantado = pesoLevantado || log.PesoLevantado;
      log.Repeticoes = repeticoes || log.Repeticoes;
      log.Observacoes = observacoes || log.Observacoes;
      
      // Salvar as alterações
      await log.save();

      res.status(200).json({ message: 'Log de performance atualizado com sucesso!', log });
  } catch (error) {
      res.status(500).json({
          message: 'Erro ao atualizar log de performance',
          error: error.message,
      });
  }
};




module.exports = {
  createProgressoRegistro,
  getProgresso,
  deleteProgresso,
  updateProgresso,
  createPerformanceLog,
  getPerformanceLogs,
  deletePerformanceLog,
  updatePerformanceLog,
};
