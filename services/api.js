import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Constants from "expo-constants"

const refreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken")
    if (refreshToken) {
      const response = await api.post("/auth/refresh-token", { refreshToken })
      if (response.data && response.data.token) {
        await AsyncStorage.setItem("userToken", response.data.token)
        return response.data.token
      }
    }
  } catch (error) {
    console.error("Erro ao renovar token:", error)
  }
  return null
}

const API_URL = "http://192.168.0.215:3000/api" // Adjust this URL if needed
console.log("URL da API:", API_URL)

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Adiciona um interceptador de requisição para incluir o token nos cabeçalhos
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("userToken")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      console.log("Requisição:", {
        method: config.method.toUpperCase(),
        url: config.url,
        headers: config.headers,
      })
    } catch (error) {
      console.error("Erro ao obter token:", error)
    }
    return config
  },
  (error) => {
    console.error("Erro na Requisição:", error)
    return Promise.reject(error)
  },
)

// Adiciona um interceptador de resposta para tratar erros
api.interceptors.response.use(
  (response) => {
    console.log("Resposta bem-sucedida:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    })
    return response
  },
  async (error) => {
    console.error("Erro na Resposta:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    })

    if (error.response?.status === 401) {
      const newToken = await refreshToken()
      if (newToken) {
        error.config.headers["Authorization"] = `Bearer ${newToken}`
        return api.request(error.config)
      }
    }

    if (error.response?.status === 403 || error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem("userToken")
        await AsyncStorage.removeItem("refreshToken")
        // Aqui você pode adicionar lógica para redirecionar o usuário para a tela de login
      } catch (e) {
        console.error("Erro ao remover tokens:", e)
      }
    }

    return Promise.reject(error)
  },
)

// Função auxiliar para retry
const withRetry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn()
  } catch (error) {
    if (retries > 0 && (error.response?.status === 500 || error.response?.status === 503)) {
      console.log(`Tentando novamente... ${retries} tentativas restantes`)
      await new Promise((resolve) => setTimeout(resolve, delay))
      return withRetry(fn, retries - 1, delay * 2)
    }
    throw error
  }
}

// Rotas de autenticação
export const loginUsuario = async (email, senha) => {
  try {
    const response = await api.post("/auth/login", { email, senha })
    if (response.data.token) {
      await AsyncStorage.setItem("userToken", response.data.token)
    }
    if (response.data.refreshToken) {
      await AsyncStorage.setItem("refreshToken", response.data.refreshToken)
    }
    return response.data
  } catch (error) {
    console.error("Erro no login:", error.response?.data || error.message)
    throw error.response?.data || error.message
  }
}

export const registrarUsuario = async (dadosUsuario) => {
  try {
    const response = await api.post("/auth/registro/usuario", dadosUsuario)
    return response.data
  } catch (error) {
    console.error("Erro no registro de usuário:", error.response?.data || error.message)
    throw error.response?.data || error.message
  }
}

export const registrarPersonal = async (dadosPersonal) => {
  try {
    const response = await api.post("/auth/registro/personal", dadosPersonal)
    return response.data
  } catch (error) {
    console.error("Erro no registro de personal:", error.response?.data || error.message)
    throw error.response?.data || error.message
  }
}

// Rotas de dados
export const criarRegistroProgresso = async (dadosProgresso) => {
  try {
    const response = await api.post("/data/progress", dadosProgresso)
    return response.data
  } catch (error) {
    console.error("Erro ao criar registro de progresso:", error.response?.status, error.response?.data)
    throw error.response?.data || error.message
  }
}

export const obterProgresso = async () => {
  return withRetry(async () => {
    try {
      const response = await api.get("/data/progress")
      console.log("Dados de progresso recebidos:", response.data)
      return response.data
    } catch (error) {
      console.error("Erro ao obter progresso:", error.response?.data || error.message)
      throw error
    }
  })
}

export const deletarProgresso = async (id) => {
  try {
    const response = await api.delete(`/data/progress/${id}`)
    return response.data
  } catch (error) {
    console.error("Erro ao deletar progresso:", error.response?.status, error.response?.data)
    throw error.response?.data || error.message
  }
}

export const atualizarProgresso = async (id, dadosProgresso) => {
  try {
    const response = await api.put(`/data/progress/${id}`, dadosProgresso)
    return response.data
  } catch (error) {
    console.error("Erro ao atualizar progresso:", error.response?.status, error.response?.data)
    throw error.response?.data || error.message
  }
}

// Performance Log routes
export const criarLogDesempenho = async (dadosDesempenho) => {
  try {
    const response = await api.post("/data/performance-logs", dadosDesempenho)
    return response.data
  } catch (error) {
    console.error("Erro ao criar log de desempenho:", error.response?.status, error.response?.data)
    throw error.response?.data || error.message
  }
}

export const obterLogsDesempenho = async () => {
  return withRetry(async () => {
    try {
      const response = await api.get("/data/performance-logs")
      console.log("Dados de desempenho recebidos:", response.data)
      return response.data
    } catch (error) {
      console.error("Erro ao obter logs de desempenho:", error.response?.data || error.message)
      throw error
    }
  })
}

export const deletarLogDesempenho = async (id) => {
  try {
    const response = await api.delete(`/data/performance-logs/${id}`)
    return response.data
  } catch (error) {
    console.error("Erro ao deletar log de desempenho:", error.response?.status, error.response?.data)
    throw error.response?.data || error.message
  }
}

export const atualizarLogDesempenho = async (id, dadosDesempenho) => {
  try {
    const response = await api.put(`/data/performance-logs/${id}`, dadosDesempenho)
    return response.data
  } catch (error) {
    console.error("Erro ao atualizar log de desempenho:", error.response?.status, error.response?.data)
    throw error.response?.data || error.message
  }
}

// Rotas de calorias
export const definirMetaCalorias = async (dadosMeta) => {
  try {
    const response = await api.post("/refeicoes/meta-calorias", dadosMeta)
    return response.data
  } catch (error) {
    console.error("Erro ao definir meta de calorias:", error.response?.data || error.message)
    throw error.response?.data || error.message
  }
}

export const registrarRefeicao = async (dadosRefeicao) => {
  try {
    const response = await api.post("/refeicoes/comeu", dadosRefeicao)
    return response.data
  } catch (error) {
    console.error("Erro ao registrar refeição:", error.response?.data || error.message)
    throw error.response?.data || error.message
  }
}

export const editarRefeicao = async (id, dadosRefeicao) => {
  try {
    const response = await api.put(`/refeicoes/comeu/${id}`, dadosRefeicao)
    return response.data
  } catch (error) {
    console.error("Erro ao editar refeição:", error.response?.data || error.message)
    throw error.response?.data || error.message
  }
}

export const deletarRefeicao = async (id) => {
  try {
    const response = await api.delete(`/refeicoes/remover/${id}`)
    return response.data
  } catch (error) {
    console.error("Erro ao deletar refeição:", error.response?.data || error.message)
    throw error.response?.data || error.message
  }
}

export const obterAlimentosPorTipoRefeicao = async (tipoRefeicaoId) => {
  try {
    console.log("Buscando alimentos para o tipo:", tipoRefeicaoId)
    const response = await api.get(`/refeicoes/alimentos/tipo_refeicao/${tipoRefeicaoId}`)
    console.log("Resposta da API:", response.data)
    return response.data
  } catch (error) {
    console.error("Erro ao obter alimentos:", error.response?.data || error.message)
    if (error.response?.status === 404) {
      return []
    }
    throw error
  }
}

export const obterRefeicoesDiarias = async (data) => {
  try {
    console.log("Solicitando refeições diárias para:", data)
    const response = await api.get(`/refeicoes/consumido/${data}`)
    console.log("Resposta bruta da API:", JSON.stringify(response.data, null, 2))

    // Verifica se a resposta é um objeto não vazio
    if (typeof response.data === "object" && Object.keys(response.data).length > 0) {
      console.log("Dados de refeições recebidos com sucesso")
      return response.data
    } else {
      console.log("Nenhuma refeição encontrada ou formato inválido")
      return {}
    }
  } catch (error) {
    console.error("Erro ao obter refeições diárias:", error.response?.data || error.message)
    if (error.response && error.response.status === 404) {
      console.log("Nenhuma refeição encontrada para esta data")
      return {}
    }
    throw error
  }
}

export const obterResumoDiario = async (data) => {
  try {
    const response = await api.get(`/refeicoes/resumo-diario?data_registro=${data}`)
    return response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Retorna um objeto com valores padrão se não houver resumo
      return {
        totalCalories: 0,
        remainingCalories: 0,
        macros: { protein: 0, carbs: 0, fat: 0 },
      }
    }
    throw error
  }
}

export const atualizarRefeicao = async (id, dadosRefeicao) => {
  try {
    const response = await api.put(`/refeicoes/comeu/${id}`, dadosRefeicao)
    return response.data
  } catch (error) {
    console.error("Erro ao atualizar refeição:", error.response?.data || error.message)
    throw error.response?.data || error.message
  }
}

// Novas rotas para Personal Trainer
export const enviarSolicitacaoPersonal = async (dadosSolicitacao) => {
  try {
    const response = await api.post("/personal/solicitar", dadosSolicitacao)
    return response.data
  } catch (error) {
    console.error("Erro ao enviar solicitação:", error.response?.data || error.message)
    throw error.response?.data || error.message
  }
}

export const obterSolicitacoesPersonal = async () => {
  try {
    const response = await api.get("/personal/solicitacoes")
    return response.data
  } catch (error) {
    console.error("Erro ao obter solicitações:", error.response?.data || error.message)
    throw error.response?.data || error.message
  }
}

export const aceitarSolicitacao = async (solicitacaoId) => {
  try {
    const response = await api.post(`/personal/solicitacoes/${solicitacaoId}/aceitar`)
    return response.data
  } catch (error) {
    console.error("Erro ao aceitar solicitação:", error.response?.data || error.message)
    throw error.response?.data || error.message
  }
}

export const recusarSolicitacao = async (solicitacaoId) => {
  try {
    const response = await api.post(`/personal/solicitacoes/${solicitacaoId}/recusar`)
    return response.data
  } catch (error) {
    console.error("Erro ao recusar solicitação:", error.response?.data || error.message)
    throw error.response?.data || error.message
  }
}

export const enviarPlanoTreino = async (solicitacaoId, dadosPlano) => {
  try {
    const response = await api.post(`/personal/solicitacoes/${solicitacaoId}/plano`, dadosPlano)
    return response.data
  } catch (error) {
    console.error("Erro ao enviar plano:", error.response?.data || error.message)
    throw error.response?.data || error.message
  }
}

// Exercícios
export const obterExercicios = async () => {
  try {
    const response = await api.get("/exercicios")
    console.log("Resposta da API (exercícios):", response.data)
    return response.data
  } catch (error) {
    console.error("Erro ao obter exercícios:", error.response?.data || error.message)
    throw error
  }
}

export const obterTiposExercicios = async () => {
  try {
    const response = await api.get("/planos/tipos")
    return response.data
  } catch (error) {
    console.error("Erro ao obter tipos de exercícios:", error)
    throw error
  }
}

export const obterExerciciosPorTipo = async (tipoId) => {
  try {
    if (!tipoId) {
      console.log("Tipo de exercício não selecionado")
      return []
    }
    const response = await api.get(`/planos/exercicios/${tipoId}`)
    console.log("Exercícios por tipo:", response.data)
    return response.data
  } catch (error) {
    console.error("Erro ao obter exercícios por tipo:", error)
    if (error.response?.status === 404) {
      return []
    }
    throw error
  }
}

export const obterExercicioPorId = async (id) => {
  try {
    const response = await api.get(`/exercicios/${id}`)
    console.log("Exercício por ID:", response.data)
    return response.data
  } catch (error) {
    console.error("Erro ao obter exercício por ID:", error.response?.data || error.message)
    throw error
  }
}

// Planos de Treino
export const obterPlanosTreino = async () => {
  try {
    const response = await api.get("/planos-treino")
    return response.data
  } catch (error) {
    console.error("Erro ao obter planos de treino:", error.response?.data || error.message)
    throw error
  }
}

export const obterTreinoDoDia = async (diaSemanaId) => {
  try {
    const response = await api.get(`/planos/planos-do-dia/${diaSemanaId}`)
    return response.data
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Return an empty array if no plan is found for the day
      return []
    }
    console.error("Erro ao obter treino do dia:", error.response?.data || error.message)
    throw error
  }
}

export const criarPlanoTreino = async (dadosPlano) => {
  try {
    const response = await api.post("/planos-treino", dadosPlano)
    return response.data
  } catch (error) {
    console.error("Erro ao criar plano de treino:", error.response?.data || error.message)
    throw error
  }
}

export const atualizarPlanoTreino = async (id, dadosPlano) => {
  try {
    const response = await api.put(`/planos-treino/${id}`, dadosPlano)
    return response.data
  } catch (error) {
    console.error("Erro ao atualizar plano de treino:", error.response?.data || error.message)
    throw error
  }
}

export const deletarPlanoTreino = async (id) => {
  try {
    const response = await api.delete(`/planos-treino/${id}`)
    return response.data
  } catch (error) {
    console.error("Erro ao deletar plano de treino:", error.response?.data || error.message)
    throw error
  }
}

export const criarNovoPlanoTreino = async (dadosPlano) => {
  try {
    console.log("Dados enviados para criar plano:", JSON.stringify(dadosPlano, null, 2))
    const response = await api.post("/planos/criar-plano", dadosPlano)
    console.log("Resposta do servidor:", response.data)
    return response.data
  } catch (error) {
    console.error("Erro ao criar plano de treino:", error.response?.data || error.message)
    throw error.response?.data || error
  }
}

export const obterExerciciosPorPlanoId = async (planoId) => {
  try {
    const response = await api.get(`/planos/exercicios-do-plano/${planoId}`)
    console.log("Exercícios do plano:", response.data)
    return response.data
  } catch (error) {
    console.error("Erro ao obter exercícios do plano:", error)
    if (error.response?.status === 404) {
      return []
    }
    throw error
  }
}

// Function to list all personal trainers
export const listarPersonalTrainers = async () => {
  try {
    const response = await api.get("/solicitacao/personal-trainers")
    console.log("Personal trainers response:", response.data)
    return response.data
  } catch (error) {
    console.error("Erro ao listar personal trainers:", error)
    throw error
  }
}

export const criarSolicitacaoDePlano = async (data) => {
  try {
    const response = await api.post("/solicitacao/criar-solicitacao", data)
    return response.data
  } catch (error) {
    console.error("Erro ao criar solicitação de plano:", error)
    throw error
  }
}

// Function to list pending requests for a personal trainer
export const listarSolicitacoesPendentes = async () => {
  try {
    const response = await api.get("/solicitacao/pendentes")
    return response.data
  } catch (error) {
    console.error("Erro ao listar solicitações pendentes:", error)
    throw error
  }
}

// Function to respond to a request
export const responderSolicitacao = async (solicitacaoId, data) => {
  try {
    const response = await api.post(`/solicitacao/responder/${solicitacaoId}`, data)
    return response.data
  } catch (error) {
    console.error("Erro ao responder solicitação:", error)
    throw error
  }
}

// Function to refuse a request
export const recusarSolicitacao2 = async (solicitacaoId) => {
  //Renamed to avoid conflict
  try {
    const response = await api.put(`/solicitacao/recusar/${solicitacaoId}`)
    return response.data
  } catch (error) {
    console.error("Erro ao recusar solicitação:", error)
    throw error
  }
}

export default {
  loginUsuario,
  registrarUsuario,
  registrarPersonal,
  criarRegistroProgresso,
  obterProgresso,
  deletarProgresso,
  atualizarProgresso,
  criarLogDesempenho,
  obterLogsDesempenho,
  deletarLogDesempenho,
  atualizarLogDesempenho,
  definirMetaCalorias,
  registrarRefeicao,
  editarRefeicao,
  deletarRefeicao,
  obterAlimentosPorTipoRefeicao,
  obterRefeicoesDiarias,
  obterResumoDiario,
  atualizarRefeicao,
  enviarSolicitacaoPersonal,
  obterSolicitacoesPersonal,
  aceitarSolicitacao,
  recusarSolicitacao,
  enviarPlanoTreino,
  obterExercicios,
  obterExercicioPorId,
  obterPlanosTreino,
  obterTreinoDoDia,
  criarPlanoTreino,
  atualizarPlanoTreino,
  deletarPlanoTreino,
  obterExerciciosPorTipo,
  obterTiposExercicios,
  criarNovoPlanoTreino,
  obterExerciciosPorPlanoId,
  listarPersonalTrainers,
  criarSolicitacaoDePlano,
  listarSolicitacoesPendentes,
  responderSolicitacao,
  recusarSolicitacao2,
}

