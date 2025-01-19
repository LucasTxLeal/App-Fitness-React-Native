const DiasDaSemana = require('../models/DiasDaSemanaModel');
const PlanosDeTreino = require('../models/PlanosDeTreinoModel');
const TipoDeTreinos = require('../models/TipoDeTreinosModel');
const Exercicios = require('../models/ExerciciosModel');
const ExerciciosNoPlano = require('../models/ExerciciosNoPlanoModel');
const Conta = require('../models/ContaModel');
const TiposDeTreinoNoPlano = require('../models/TiposDeTreinoNoPlanoModel');
const Videos = require('../models/VideosModel'); 
const { Op } = require('sequelize');

const RegistrarPlanoDeTreino = async (req, res) => {
  const transaction = await PlanosDeTreino.sequelize.transaction();

  try {
    const { contaId, nomePlano, diaSemanaId, tiposDeTreino } = req.body;

    // Validações iniciais
    if (!contaId || !nomePlano || !diaSemanaId || !Array.isArray(tiposDeTreino) || tiposDeTreino.length === 0) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado ou inválido.' });
    }

    // Valida se já existe um plano com o mesmo nome
    const [planoExistente, diaSemana] = await Promise.all([
      PlanosDeTreino.findOne({ where: { nome: nomePlano, contaId } }),
      DiasDaSemana.findByPk(diaSemanaId),
    ]);

    if (planoExistente) {
      return res.status(400).json({ message: 'Já existe um plano de treino com esse nome.' });
    }
    if (!diaSemana) {
      return res.status(400).json({ message: 'Dia da semana inválido.' });
    }

    // Cria o plano de treino
    const planoDeTreino = await PlanosDeTreino.create(
      { nome: nomePlano, contaId, criadoPorId: userId, diaSemanaId },
      { transaction }
    );

    if (!planoDeTreino || !planoDeTreino.id) {
      throw new Error('Falha ao criar o plano de treino.');
    }

    // Processa tipos de treino e exercícios
    const tiposDeTreinoPromises = tiposDeTreino.map(async ({ tipo_id, exercicios }) => {
      const tipoTreino = await TipoDeTreinos.findByPk(tipo_id);
      if (!tipoTreino) {
        throw new Error(`Tipo de treino com ID ${tipo_id} não encontrado.`);
      }

      // Cria associação entre plano e tipo de treino
      await TiposDeTreinoNoPlano.create(
        { planoId: planoDeTreino.id, tipoDeTreinoId: tipo_id },
        { transaction }
      );

      // Valida e associa os exercícios
      const exercicioPromises = exercicios.map(async ({ exercicio_id, duracao }) => {
        const exercicioExistente = await Exercicios.findByPk(exercicio_id);
        if (!exercicioExistente) {
          throw new Error(`Exercício com ID ${exercicio_id} não encontrado.`);
        }

        return ExerciciosNoPlano.create(
          { plano_id: planoDeTreino.id, exercicio_id, duracao },
          { transaction }
        );
      });

      await Promise.all(exercicioPromises);

      // Retorna os detalhes do tipo de treino e exercícios associados
      const exerciciosDetalhes = await ExerciciosNoPlano.findAll({
        where: { plano_id: planoDeTreino.id },
        include: [{ model: Exercicios, as: 'exercicio', attributes: ['id', 'nome', 'descricao', 'musculoAlvo'] }],
        attributes: ['duracao'],
      });

      return { tipoTreino: { id: tipoTreino.id, nome: tipoTreino.nome }, exercicios: exerciciosDetalhes };
    });

    const tiposDeTreinoComExercicios = await Promise.all(tiposDeTreinoPromises);

    // Commit da transação
    await transaction.commit();

    return res.status(201).json({
      message: 'Plano de treino registrado com sucesso!',
      planoDeTreino: {
        id: planoDeTreino.id,
        nome: planoDeTreino.nome,
        contaId: planoDeTreino.contaId,
        criadoPorId: planoDeTreino.criadoPorId,
        diaSemanaId: planoDeTreino.diaSemanaId,
        tiposDeTreino: tiposDeTreinoComExercicios,
      },
    });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Erro ao registrar plano de treino:', error);
    return res.status(500).json({ message: 'Erro ao registrar plano de treino', error: error.message });
  }
};



//////////////////////////////////////////////////////////

// Função para buscar os planos de treino do usuário autenticado para um dia específico
const getPlanosDeTreinoPorDia = async (req, res) => {
  try {
    const { id: userId } = req.user; // ID do usuário autenticado
    const { diaSemanaId } = req.params; // ID do dia da semana passado como parâmetro
    console.log(req.params)
    // Buscar os planos de treino associados ao usuário autenticado e ao dia selecionado
    const planos = await PlanosDeTreino.findAll({
      where: { 
        contaId: userId,       // Filtro pelo usuário autenticado
        diaSemanaId: diaSemanaId, // Filtro pelo dia da semana
      },
      order: [['dataCriacao', 'DESC']], // Ordenar pela data de criação mais recente
      include: [
        { association: 'criador', attributes: ['nome'] },
        { association: 'diaSemana', attributes: ['nome'] },
      ],
    });

    // Retorna 404 se nenhum plano for encontrado
    if (!planos || planos.length === 0) {
      return res.status(404).json({ message: 'Nenhum plano de treino encontrado para o dia selecionado.' });
    }

    // Retorna os planos encontrados
    res.status(200).json(planos);
  } catch (error) {
    console.error('Erro ao buscar planos de treino:', error.message);
    res.status(500).json({ error: 'Erro ao buscar planos de treino.' });
  }
};


const excluirPlanoDeTreino = async (req, res) => {
  const { planoId } = req.params; // Obtém o ID do plano de treino dos parâmetros da rota
  const usuarioAutenticado = req.user; // Dados do usuário autenticado (fornecidos pelo middleware de autenticação)

  try {
    // Busca o plano de treino pelo ID
    const plano = await PlanosDeTreino.findOne({
      where: { id: planoId },
    });

    // Verifica se o plano existe
    if (!plano) {
      return res.status(404).json({ message: 'Plano de treino não encontrado.' });
    }

    // Verifica se o plano pertence ao usuário autenticado
    if (plano.contaId !== usuarioAutenticado.id) {
      return res.status(403).json({ message: 'Acesso negado. Este plano não pertence ao usuário autenticado.' });
    }

    // Exclui o plano de treino
    await plano.destroy();

    res.status(200).json({ message: 'Plano de treino excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir plano de treino:', error.message);
    res.status(500).json({ error: 'Erro ao excluir plano de treino.' });
  }
};


const getTiposDeTreinoPorPlanoId = async (req, res) => {
  const { planoId } = req.params; // Obtém o ID do plano dos parâmetros da rota

  try {
    // Busca os tipos de treino associados ao plano específico
    const tiposDeTreinoNoPlano = await TiposDeTreinoNoPlano.findAll({
      where: { planoId }, // Filtra pelo planoId
      attributes: ['id'], // Inclui apenas o ID da tabela TiposDeTreinoNoPlano
      include: [
        {
          model: TipoDeTreinos,
          as: 'tipoDeTreino',
          attributes: ['id', 'nome'], // Inclui os campos relevantes de TipoDeTreinos
        },
      ],
    });

    // Verifica se há tipos de treino associados ao plano
    if (!tiposDeTreinoNoPlano || tiposDeTreinoNoPlano.length === 0) {
      return res.status(404).json({ message: 'Nenhum tipo de treino encontrado para o plano especificado.' });
    }

    res.status(200).json(tiposDeTreinoNoPlano);
  } catch (error) {
    console.error('Erro ao buscar tipos de treino do plano:', error.message);
    res.status(500).json({ error: 'Erro ao buscar tipos de treino do plano.' });
  }
};


// Função para buscar exercícios de um plano específico
const getExerciciosPorPlanoId = async (req, res) => {
  const { planoId } = req.params; // Obtém o ID do plano dos parâmetros da rota

  try {
    // Busca os exercícios associados ao plano específico
    const exerciciosNoPlano = await ExerciciosNoPlano.findAll({
      where: { plano_id: planoId },
      attributes: ['id', 'duracao'], // Inclui ID e duração do exercício no plano
      include: [
        {
          model: Exercicios,
          as: 'exercicio',
          attributes: ['id', 'nome', 'descricao', 'tipoDeTreinoId'], // Inclui o tipoDeTreinoId do exercício
        },
      ],
    });

    // Verifica se o plano possui exercícios
    if (!exerciciosNoPlano || exerciciosNoPlano.length === 0) {
      return res.status(404).json({ message: 'Nenhum exercício encontrado para o plano especificado.' });
    }

    res.status(200).json(exerciciosNoPlano);
  } catch (error) {
    console.error('Erro ao buscar exercícios do plano:', error.message);
    res.status(500).json({ error: 'Erro ao buscar exercícios do plano.' });
  }
};







const getExerciciosPorTipo = async (req, res) => {
  const { tipoExercicio } = req.params; // Obtém o tipo de exercício dos parâmetros da rota

  try {
    // Busca os exercícios que correspondem ao tipo especificado
    const exercicios = await Exercicios.findAll({
      where: { tipodetreinoid: tipoExercicio }, // Use o nome correto da coluna no banco de dados
      attributes: ['id', 'nome', 'descricao', 'tipoDeTreinoId', 'musculoAlvo'], // Campos desejados
    });

    // Verifica se existem exercícios com o tipo especificado
    if (!exercicios || exercicios.length === 0) {
      return res.status(404).json({ message: 'Nenhum exercício encontrado para o tipo especificado.' });
    }

    res.status(200).json(exercicios);
  } catch (error) {
    console.error('Erro ao buscar exercícios por tipo:', error.message);
    res.status(500).json({ error: 'Erro ao buscar exercícios por tipo.' });
  }
};


const getVideoPorExercicio = async (req, res) => {
  const { exercicioId } = req.params; // Obtém o ID do exercício dos parâmetros da rota

  try {
    // Busca o vídeo associado ao ID do exercício
    const video = await Videos.findOne({
      where: { exercicioid: exercicioId }, // Use o nome correto da coluna no banco
      attributes: ['nome', 'url'], // Seleciona apenas o nome e a URL do vídeo
    });

    // Verifica se um vídeo foi encontrado
    if (!video) {
      return res
        .status(404)
        .json({ message: 'Nenhum vídeo encontrado para o exercício especificado.' });
    }

    res.status(200).json(video);
  } catch (error) {
    console.error('Erro ao buscar vídeo por exercício:', error.message);
    res.status(500).json({ error: 'Erro ao buscar vídeo por exercício.' });
  }
};


module.exports = 
{ 
  RegistrarPlanoDeTreino ,
  getPlanosDeTreinoPorDia,
  getTiposDeTreinoPorPlanoId,
  getExerciciosPorPlanoId,
  excluirPlanoDeTreino,
  getExerciciosPorTipo,
  getVideoPorExercicio,
};