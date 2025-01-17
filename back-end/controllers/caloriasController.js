const CaloriasMeta = require('../models/CaloriasMetaModel');
const Refeicoes = require('../models/RefeicoesModel');
const Alimentos = require('../models/AlimentosModel'); // Certifique-se de importar o modelo de Alimentos
const { Sequelize } = require('sequelize');
const TiposAlimentos = require('../models/TiposAlimentosModel');

const MetaCaloria = async (req, res) => {
  try {
    const userId = req.user.id; // Obtém o ID do usuário do token
    const { meta_calorias, data_registro } = req.body; // Obtém os dados enviados

    console.log('Dados recebidos:', req.body);

    // Verifica se já existe uma meta para esse usuário e data
    const meta = await CaloriasMeta.findOne({
      where: { ContaId: userId, data_registro }, // Verifica a condição
    });

    if (meta) {
      // Se já existir, atualiza a meta
      meta.meta_calorias = meta_calorias;
      await meta.save();
      return res.status(200).json({ message: 'Meta atualizada com sucesso!', meta });
    } else {
      // Caso contrário, cria uma nova meta
      const novaMeta = await CaloriasMeta.create({
        ContaId: userId,
        meta_calorias,
        data_registro,
      });
      return res.status(201).json({ message: 'Meta criada com sucesso!', novaMeta });
    }
  } catch (error) {
    console.error("Erro no servidor:", error.message);
    res.status(500).json({ message: 'Erro ao definir meta', error: error.message });
  }
};

  
  
  
  
  
  ///////////////////////////////////////////
  const RegistrarConsumo = async (req, res) => {
    try {
      const userId = req.user.id; // Obtém o ID do usuário do token
      const { tipo_id, alimento_id, quantidade_gramas, data_registro } = req.body; // Obtém os dados enviados
  
      console.log('Dados recebidos:', req.body); // Adicionando um log para verificar os dados
  
      // Verifica se todos os campos obrigatórios estão presentes
      if (!tipo_id || !alimento_id || !quantidade_gramas || !data_registro) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
      }
  
      // Verifica se o userId está presente e válido
      if (!userId) {
        return res.status(400).json({ message: 'Usuário não autenticado ou inválido.' });
      }
  
      // Verifica se o alimento existe
      const alimento = await Alimentos.findOne({ where: { id: alimento_id } });
      if (!alimento) {
        return res.status(400).json({ message: 'Alimento não encontrado.' });
      }
  
      // Verifica se o tipo de refeição existe e obtém o nome
      const tipoRefeicao = await TiposAlimentos.findOne({ where: { id: tipo_id } });
      if (!tipoRefeicao) {
        return res.status(400).json({ message: 'Tipo de refeição não encontrado.' });
      }
  
      // Verifica se o alimento pertence ao tipo de refeição correto
      if (alimento.tipo_id !== tipo_id) {
        return res.status(400).json({
          message: `Este alimento não pertence ao tipo de refeição '${tipoRefeicao.tipo_nome}'`, // Usa o nome do tipo de refeição
        });
      }
  
      // Permite múltiplos alimentos no mesmo dia, desde que os alimentos sejam diferentes
      const consumoExistente = await Refeicoes.findOne({
        where: { contaid: userId, data_registro, alimento_id },
      });
  
      if (consumoExistente) {
        return res.status(400).json({ message: 'Este alimento já foi registrado nesta data.' });
      }
  
      // Criação do novo consumo
      const refeicao = await Refeicoes.create({
        contaid: userId,
        tipo_id,  // Usando tipo_id para o campo tipo_id
        alimento_id,
        quantidade_gramas,
        data_registro,
      });
  
      // Retorna resposta de sucesso
      res.status(201).json({ message: 'Consumo registrado com sucesso!', refeicao });
    } catch (error) {
      console.error(error); // Log de erro para depuração
      res.status(500).json({ message: 'Erro ao registrar consumo', error });
    }
  };
  
  
  
  
  
  

  
  
  





  const EditarConsumo = async (req, res) => {
    try {
        const { id } = req.params; // ID do consumo a ser atualizado
        const userId = req.user.id; // Obtém o ID do usuário do token
        let { quantidade_gramas } = req.body; // Extraindo o valor do body

        // Verificar se o ID é válido
        if (isNaN(id)) {
            return res.status(400).json({ message: 'ID inválido fornecido.' });
        }

        // Buscar o registro no banco de dados
        const consumo = await Refeicoes.findByPk(id);

        if (!consumo) {
            return res.status(404).json({ message: 'Consumo não encontrado.' });
        }

        // Verificar se o consumo pertence ao usuário autenticado
        if (consumo.contaid !== userId) {
    
            return res.status(403).json({ message: 'Acesso negado. Você não pode editar este consumo.' });
        }

        // Verificar se a quantidade de gramas foi fornecida
        if (!quantidade_gramas) {
            return res.status(400).json({ message: 'Quantidade de gramas não foi fornecida.' });
        }

        // Garantir que quantidade_gramas seja tratado como número e não seja menor que 0.1
        quantidade_gramas = parseFloat(quantidade_gramas);
      
        if (isNaN(quantidade_gramas) || quantidade_gramas < 0.1) {
            return res.status(400).json({ message: 'Quantidade de gramas deve ser um número maior ou igual a 0.1.' });
        }

        // Convertendo consumo.quantidade_gramas para float antes de comparar
        const currentQuantidade = parseFloat(consumo.quantidade_gramas);
        if (currentQuantidade !== quantidade_gramas) {
            // Atualizar o objeto com a nova quantidade
            consumo.quantidade_gramas = quantidade_gramas;

            // Salvar as alterações no banco
            await consumo.save();
        } 

        res.status(200).json({ message: 'Consumo atualizado com sucesso!', consumo });
    } catch (error) {
        console.error('Erro ao atualizar consumo:', error); // Log do erro
        res.status(500).json({
            message: 'Erro ao atualizar consumo',
            error: error.message,
        });
    }
};



  

  

const ExcluirConsumo = async (req, res) => {
  try {
      const { id } = req.params; // ID do consumo a ser excluído
      const userId = req.user.id; // ID do usuário autenticado

      console.log("Params recebidos:", req.params);
      console.log("ID recebido:", id); // Exibir o ID recebido para diagnóstico

      // Verificar se o ID é válido
      if (isNaN(id)) {
          return res.status(400).json({ message: 'ID inválido fornecido.' });
      }

      // Buscar o registro no banco
      const refeicao = await Refeicoes.findByPk(id);

      if (!refeicao) {
          return res.status(404).json({ message: 'Consumo não encontrado.' });
      }

      // Verificar se o consumo pertence ao usuário autenticado
      if (refeicao.contaid !== userId) {
          console.log("Acesso negado:", { consumoUsuario: refeicao.contaid, autenticado: userId });
          return res.status(403).json({ message: 'Acesso negado. Você não pode excluir este consumo.' });
      }

      // Excluir o consumo
      await refeicao.destroy();
      console.log("Consumo removido com sucesso. ID:", id);
      res.status(200).json({ message: 'Consumo removido com sucesso!' });
  } catch (error) {
      console.error("Erro ao remover consumo:", error);
      res.status(500).json({
          message: 'Erro ao remover consumo',
          error: error.message,
      });
  }
};

  
  ////////////////////////////////////
  const VerResumoDiario = async (req, res) => {
    try {
      const { id: userId } = req.user; // Obtém o id do usuário a partir do token
      const { data_registro } = req.query; // Obtém a data de registro da query
  
      // Validações iniciais
      if (!data_registro) {
        return res.status(400).json({ message: 'A data de registro é obrigatória.' });
      }
  
      // Buscar refeições e incluir alimentos
      const refeicoes = await Refeicoes.findAll({
        where: { contaid: userId, data_registro }, // Alterado para usar contaid
        include: {
          model: Alimentos,
          as: 'alimento', // Associar com o modelo Alimentos
          attributes: ['calorias', 'proteinas', 'gorduras'], // Inclui apenas os campos necessários
        },
        attributes: ['id', 'quantidade_gramas', 'data_registro'], // Define os campos necessários de Refeicoes
        raw: false, // Evita transformar em objetos puros para manter as associações
      });
  
      console.log('Refeições encontradas:', refeicoes);
  
      // Se nenhuma refeição for encontrada
      if (!refeicoes || refeicoes.length === 0) {
        return res.status(200).json({ message: 'Nenhuma refeição encontrada para a data fornecida.', resumo: {} });
      }
  
      // Cálculo dos totais com consulta bruta
      const [resumo] = await Refeicoes.sequelize.query(`
        SELECT 
          COALESCE(SUM(alimentos.calorias * refeicoes.quantidade_gramas / 100), 0) as calorias,
          COALESCE(SUM(alimentos.proteinas * refeicoes.quantidade_gramas / 100), 0) as proteinas,
          COALESCE(SUM(alimentos.gorduras * refeicoes.quantidade_gramas / 100), 0) as gorduras
        FROM refeicoes
        INNER JOIN alimentos ON refeicoes.alimento_id = alimentos.id
        WHERE refeicoes.contaid = :userId AND refeicoes.data_registro = :data_registro
      `, {
        replacements: { userId, data_registro },
        type: Sequelize.QueryTypes.SELECT,
      });
  
      console.log('Resumo final:', resumo);
  
      // Retorna o resumo diário
      res.status(200).json({ data_registro, resumo });
    } catch (error) {
      console.error('Erro ao calcular resumo diário:', error);
      res.status(500).json({ message: 'Erro ao calcular resumo diário', error });
    }
  };
  

  const ObterRefeicoesPorUsuario = async (req, res) => {
    try {
      const { data_registro } = req.params;  // Data da URL
      const userId = req.user.id;
      console.log(req.body);
      // Log para depuração
      console.log('Parâmetro data_registro:', data_registro);
      console.log('ID do usuário autenticado:', userId);
    
      // Busca refeições pelo usuário e data
      const refeicoes = await Refeicoes.findAll({
        where: {
          contaid: userId,
          data_registro,
        },
        include: {
          model: Alimentos,
          as: 'alimento',  // Deve ser o mesmo alias definido no belongsTo
          attributes: ['nome_alimento', 'calorias', 'proteinas', 'gorduras'],
        },
      });
  
      if (!refeicoes || refeicoes.length === 0) {
        return res.status(404).json({ message: 'Nenhuma refeição registrada para essa data.' });
      }
  
      res.status(200).json({ refeicoes });
    } catch (error) {
      console.error(error);  // Log de erro para debugging
      res.status(500).json({ message: 'Erro ao buscar refeições', error });
    }
  };
  

  

const ObterAlimentosPorTipo = async (req, res) => {
    try {
      const { tipo_refeicao } = req.params;
    
      // Usando tipo_id ao invés de tipo_refeicao, conforme o banco de dados
      const alimentos = await Alimentos.findAll({
        where: { tipo_id: tipo_refeicao },  // Filtrando por tipo_id, que é a coluna correta no banco de dados
      });
    
      if (!alimentos || alimentos.length === 0) {
        return res.status(404).json({ message: 'Nenhum alimento encontrado para este tipo de refeição.' });
      }
    
      res.status(200).json({ alimentos });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar alimentos', error });
    }
  };
  

  
module.exports = {
    MetaCaloria,
    VerResumoDiario,
    RegistrarConsumo,
    EditarConsumo,
    ExcluirConsumo,
    ObterRefeicoesPorUsuario,
    ObterAlimentosPorTipo,
  };