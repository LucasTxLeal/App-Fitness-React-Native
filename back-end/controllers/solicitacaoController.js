const DiasDaSemana = require('../models/DiasDaSemanaModel'); 
const PersonalTrainer = require('../models/PersonalTrainerModel');
const Usuario = require('../models/UsuariosModel');
const SolicitacaoDePlanoDeTreino = require('../models/SolicitacaoDePlanoDeTreinoModel');
const conta = require('../models/ContaModel');
const { RegistrarPlanoDeTreino } = require('../controllers/planoTreinoController');





// 1. Função para listar todos os personal trainers e suas informações
const listarPersonalTrainers = async (req, res) => {
  try {
    const personalTrainers = await PersonalTrainer.findAll({
      attributes: ['id', 'especialidade', 'certificado'], // Campos do modelo PersonalTrainer
      include: [
        {
          model: conta, // Incluindo o modelo conta
          as: 'conta', // Alias definido na associação
          attributes: ['id', 'Nome', 'Peso', 'Altura'], // Informações relevantes da conta
        },
      ],
    });

    if (!personalTrainers || personalTrainers.length === 0) {
      return res.status(404).json({ message: 'Nenhum personal trainer encontrado.' });
    }

    res.status(200).json(personalTrainers);
  } catch (error) {
    console.error('Erro ao listar personal trainers:', error.message);
    res.status(500).json({ error: 'Erro ao listar personal trainers.' });
  }
};



// 2. Função para criar uma solicitação de plano de treino
const criarSolicitacaoDePlano = async (req, res) => {
  const { personal_id, objetivo, descricao, diasSemana } = req.body;

  try {
    // Validação dos dias da semana
    if (!Array.isArray(diasSemana) || diasSemana.length === 0) {
      return res.status(400).json({
        error: 'Os dias da semana devem ser fornecidos em um array com pelo menos um dia.',
      });
    }

    // Obter o id da conta do usuário autenticado (está no req.user)
    const { id: contaId } = req.user;

    // Buscar o usuário associado à conta (usando 'contaid' em vez de 'contaId')
    const usuario = await Usuario.findOne({
      where: { contaid: contaId }, // Certifique-se de que está usando 'contaid' corretamente
    });

    // Verifica se o usuário foi encontrado
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado para a conta fornecida.' });
    }

    // Verifica se os dias fornecidos são válidos no banco de dados
    const diasValidos = await DiasDaSemana.findAll({
      where: {
        id: diasSemana, // Aqui estamos verificando os IDs fornecidos no array
      },
    });

    if (diasValidos.length !== diasSemana.length) {
      return res.status(400).json({
        error: 'Alguns dos dias fornecidos não são válidos.',
      });
    }

    // Criando solicitações para cada dia válido
    const solicitacoes = await Promise.all(
      diasValidos.map(async (dia) => {
        return SolicitacaoDePlanoDeTreino.create({
          usuarioId: usuario.id, // ID do usuário autenticado, que foi encontrado pela conta
          personalId: personal_id,
          objetivo,
          descricao,
          estado: 'Pendente', // Estado inicial
          diaSemanaId: dia.id, // ID do dia da semana
        });
      })
    );

    res.status(201).json({
      message: 'Solicitações de plano de treino criadas com sucesso!',
      solicitacoes,
    });
  } catch (error) {
    console.error('Erro ao criar solicitações de plano de treino:', error.message);
    res.status(500).json({ error: 'Erro ao criar solicitações de plano de treino.' });
  }
};







const listarSolicitacoesPendentes = async (req, res) => {
  const { id: contaId } = req.user; // ID da conta do personal autenticado (guardado no localStorage)

  try {
    // Buscar o personal_id baseado no id da conta
    const personal = await PersonalTrainer.findOne({
      where: { contaid: contaId },  // Buscando o personal pelo id da conta
    });

    if (!personal) {
      return res.status(404).json({ message: 'Personal trainer não encontrado para a conta fornecida.' });
    }

    const personal_id = personal.id; // Obtemos o personal_id

    // Buscar as solicitações pendentes com o personal_id
    const solicitacoesPendentes = await SolicitacaoDePlanoDeTreino.findAll({
      where: {
        personalId: personal_id,  // Vinculado ao personal autenticado
        estado: 'Pendente',  // Somente solicitações pendentes
      },
      include: [
        {
          model: Usuario, // Associa os dados do usuário
          as: 'usuario',  // Alias para a relação
          attributes: ['id', 'objetivo'], // Apenas id e objetivo de usuários
          include: [
            {
              model: conta,  // Incluindo dados da tabela `contas`
              as: 'conta',   // Alias para a relação
              attributes: ['id', 'nome', 'peso', 'altura'], // Campos da tabela `contas`
              required: true,  // Agora a associação é obrigatória
            },
          ],
        },
      ],
    });
    

    // Caso não haja solicitações pendentes
    if (!solicitacoesPendentes || solicitacoesPendentes.length === 0) {
      return res.status(404).json({ message: 'Nenhuma solicitação pendente encontrada.' });
    }

    // Retornar as solicitações pendentes para o personal trainer
    res.status(200).json(solicitacoesPendentes);
  } catch (error) {
    console.error('Erro ao listar solicitações pendentes:', error.message);
    res.status(500).json({ error: 'Erro ao listar solicitações pendentes.' });
  }
};













const responderSolicitacao = async (req, res) => {
  let transaction;

  try {
    transaction = await SolicitacaoDePlanoDeTreino.sequelize.transaction();

    const { solicitacaoId } = req.params;
    const contaId = req.user.id;

    // Verificar se o personal trainer existe
    const personal = await PersonalTrainer.findOne({ where: { contaid: contaId } });
    if (!personal) {
      return res.status(404).json({ message: 'Personal trainer não encontrado.' });
    }

    // Verificar se a solicitação existe e está pendente
    const solicitacao = await SolicitacaoDePlanoDeTreino.findOne({
      where: { id: solicitacaoId, personalId: personal.id, estado: 'Pendente' },
    });
    if (!solicitacao) {
      return res.status(404).json({ message: 'Solicitação inválida ou já processada.' });
    }

    // Verificar se o usuário da solicitação existe
    const usuario = await Usuario.findOne({
      where: { id: solicitacao.usuarioId },
      attributes: ['contaid'],
    });
    if (!usuario) {
      throw new Error('Conta do usuário não encontrada.');
    }

    // Criar o plano de treino
    req.body.contaId = usuario.contaid;
    const fakeRes = {
      status: (code) => ({
        json: (data) => ({ code, data }),
      }),
    };
    const registrarPlanoResult = await RegistrarPlanoDeTreino(req, fakeRes);

    if (registrarPlanoResult?.code !== 201) {
      throw new Error(registrarPlanoResult?.data?.message || 'Erro ao criar o plano de treino.');
    }

    // Atualizar estado da solicitação após criar o plano com sucesso
    solicitacao.estado = 'Concluida';
    await solicitacao.save({ transaction });

    // Confirmar transação
    await transaction.commit();

    // Enviar resposta ao cliente
    return res.status(200).json({
      message: 'Solicitação respondida e plano criado com sucesso.',
      solicitacao,
      planoDeTreino: registrarPlanoResult.data.planoDeTreino,
    });
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback(); // Reverter transação em caso de erro
    }

    console.error('Erro ao responder solicitação:', error.message);

    if (!res.headersSent) {
      return res.status(500).json({
        message: 'Erro ao responder solicitação.',
        error: error.message,
      });
    }
  }
};














































const recusarSolicitacao = async (req, res) => {
  const { id: contaId } = req.user; // ID da conta do personal autenticado
  const { solicitacaoId } = req.params; // ID da solicitação a ser alterada (passado como parâmetro)

  try {
    // Primeiro, buscamos o personal trainer baseado no contaId
    const personal = await PersonalTrainer.findOne({
      where: { contaid: contaId }, // Nome da coluna corrigido para contaid
    });

    // Verifica se o personal foi encontrado
    if (!personal) {
      return res.status(404).json({ message: 'Personal trainer não encontrado para a conta fornecida.' });
    }

    const personalId = personal.id; // Obtemos o personalId

    // Buscar a solicitação com o ID fornecido e verificar se é do personal correto
    const solicitacao = await SolicitacaoDePlanoDeTreino.findOne({
      where: {
        id: solicitacaoId,
        personalId, // Garantir que a solicitação pertence ao personal autenticado
      },
    });

    // Verifica se a solicitação foi encontrada
    if (!solicitacao) {
      return res.status(404).json({ message: 'Solicitação não encontrada ou você não tem permissão para alterá-la.' });
    }

    // Atualiza o estado da solicitação para "Cancelada"
    solicitacao.estado = 'Cancelada';
    await solicitacao.save();

    // Retorna a solicitação atualizada
    res.status(200).json({
      message: 'Solicitação de plano de treino cancelada com sucesso!',
      solicitacao,
    });
  } catch (error) {
    console.error('Erro ao alterar o estado da solicitação:', error.message);
    res.status(500).json({ error: 'Erro ao alterar o estado da solicitação.' });
  }
};


module.exports = {
  listarPersonalTrainers,
  criarSolicitacaoDePlano,
  listarSolicitacoesPendentes,
  responderSolicitacao,
  recusarSolicitacao,
};
