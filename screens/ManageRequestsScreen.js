import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { listarSolicitacoesPendentes, responderSolicitacao, recusarSolicitacao } from "../services/api"
import { Feather as Icon } from "@expo/vector-icons"

const DIAS_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]

const ManageRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPendingRequests()
  }, [])

  const fetchPendingRequests = async () => {
    try {
      const data = await listarSolicitacoesPendentes()
      setRequests(data)
    } catch (error) {
      console.error("Erro ao carregar solicitações:", error)
      Alert.alert("Erro", "Não foi possível carregar as solicitações pendentes.")
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (solicitacaoId) => {
    try {
      await responderSolicitacao(solicitacaoId, {})
      Alert.alert("Sucesso", "Solicitação aceita com sucesso!")
      fetchPendingRequests()
    } catch (error) {
      console.error("Erro ao aceitar solicitação:", error)
      Alert.alert("Erro", "Não foi possível aceitar a solicitação. Tente novamente.")
    }
  }

  const handleRefuse = async (solicitacaoId) => {
    try {
      await recusarSolicitacao(solicitacaoId)
      Alert.alert("Sucesso", "Solicitação recusada com sucesso!")
      fetchPendingRequests()
    } catch (error) {
      console.error("Erro ao recusar solicitação:", error)
      Alert.alert("Erro", "Não foi possível recusar a solicitação. Tente novamente.")
    }
  }

  const renderDiasSemana = (diaSemanaId) => {
    if (!diaSemanaId) return "Nenhum dia selecionado"
    return DIAS_SEMANA[diaSemanaId - 1] || "Dia inválido"
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#35AAFF" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Gerenciar Solicitações</Text>

      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text style={styles.userName}>{item.usuario?.conta?.nome || "Nome não disponível"}</Text>
            <Text style={styles.userDetails}>
              Peso: {item.usuario?.conta?.peso || "N/A"}kg, Altura: {item.usuario?.conta?.altura || "N/A"}m
            </Text>
            <Text style={styles.requestObjective}>{item.objetivo || "Sem objetivo definido"}</Text>
            <Text style={styles.requestDescription}>{item.descricao || "Sem descrição"}</Text>
            <Text style={styles.requestDays}>Dias: {renderDiasSemana(item.diaSemanaId)}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => handleAccept(item.id)}
              >
                <Text style={styles.buttonText}>Aceitar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.refuseButton]}
                onPress={() => handleRefuse(item.id)}
              >
                <Text style={styles.buttonText}>Recusar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma solicitação pendente.</Text>}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191919",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#191919",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  requestItem: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 14,
    color: "#CCCCCC",
    marginBottom: 8,
  },
  requestObjective: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  requestDescription: {
    fontSize: 14,
    color: "#CCCCCC",
    marginBottom: 8,
  },
  requestDays: {
    fontSize: 14,
    color: "#35AAFF",
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#4CD964",
    marginRight: 8,
  },
  refuseButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  emptyText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 20,
  },
})

export default ManageRequestsScreen

