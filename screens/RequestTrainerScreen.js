import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { listarPersonalTrainers, criarSolicitacaoDePlano } from "../services/api"
import { Feather as Icon } from "@expo/vector-icons"

const RequestTrainerScreen = ({ navigation }) => {
  const [personalTrainers, setPersonalTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTrainer, setSelectedTrainer] = useState(null)
  const [objetivo, setObjetivo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [diasSemana, setDiasSemana] = useState([])

  useEffect(() => {
    fetchPersonalTrainers()
  }, [])

  const fetchPersonalTrainers = async () => {
    try {
      const data = await listarPersonalTrainers()
      console.log("Personal trainers raw data:", JSON.stringify(data, null, 2))
      if (Array.isArray(data)) {
        setPersonalTrainers(data)
      } else if (data && typeof data === "object") {
        const trainersArray = Object.values(data)
        if (Array.isArray(trainersArray)) {
          setPersonalTrainers(trainersArray)
        } else {
          console.error("Dados de personal trainers em formato inválido:", data)
          setPersonalTrainers([])
        }
      } else {
        console.error("Dados de personal trainers em formato inválido:", data)
        setPersonalTrainers([])
      }
    } catch (error) {
      console.error("Erro ao carregar personal trainers:", error)
      Alert.alert("Erro", "Não foi possível carregar a lista de personal trainers.")
      setPersonalTrainers([])
    } finally {
      setLoading(false)
    }
  }

  const handleTrainerSelect = (trainer) => {
    setSelectedTrainer(trainer)
  }

  const handleDayToggle = (dayId) => {
    setDiasSemana((prev) => (prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]))
  }

  const handleSubmit = async () => {
    if (!selectedTrainer) {
      Alert.alert("Erro", "Por favor, selecione um personal trainer.")
      return
    }
    if (objetivo.trim() === "" || descricao.trim() === "") {
      Alert.alert("Erro", "Por favor, preencha todos os campos.")
      return
    }
    if (diasSemana.length === 0) {
      Alert.alert("Erro", "Por favor, selecione pelo menos um dia da semana.")
      return
    }

    try {
      const response = await criarSolicitacaoDePlano({
        personal_id: selectedTrainer.id,
        objetivo,
        descricao,
        diasSemana,
      })
      console.log("Resposta da API:", response)
      Alert.alert("Sucesso", "Solicitação enviada com sucesso!")
      navigation.goBack()
    } catch (error) {
      console.error("Erro detalhado:", error.response || error)
      Alert.alert("Erro", "Não foi possível enviar a solicitação. Tente novamente.")
    }
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
      <Text style={styles.title}>Solicitar Personal Trainer</Text>

      <FlatList
        data={personalTrainers}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.trainerItem, selectedTrainer?.id === item.id && styles.selectedTrainer]}
            onPress={() => handleTrainerSelect(item)}
          >
            <Text style={styles.trainerId}>ID: {item.id || "N/A"}</Text>
            <Text style={styles.trainerName}>{item.usuario?.nome || "Nome não disponível"}</Text>
            <Text style={styles.trainerSpecialty}>Especialidade: {item.especialidade || "Não especificada"}</Text>
            <Text style={styles.trainerDetails}>
              Peso: {item.usuario?.peso || "N/A"}kg, Altura: {item.usuario?.altura || "N/A"}m
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum personal trainer disponível.</Text>}
      />

      {selectedTrainer && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Objetivo"
            value={objetivo}
            onChangeText={setObjetivo}
            placeholderTextColor="#666"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descrição"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
            placeholderTextColor="#666"
          />
          <Text style={styles.daysTitle}>Dias da semana:</Text>
          <View style={styles.daysContainer}>
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dayButton, diasSemana.includes(index + 1) && styles.selectedDay]}
                onPress={() => handleDayToggle(index + 1)}
              >
                <Text style={styles.dayText}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Enviar Solicitação</Text>
          </TouchableOpacity>
        </View>
      )}
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
  trainerItem: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedTrainer: {
    backgroundColor: "#35AAFF",
  },
  trainerId: {
    fontSize: 14,
    color: "#CCCCCC",
    marginBottom: 4,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  trainerSpecialty: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  trainerDetails: {
    fontSize: 14,
    color: "#CCCCCC",
  },
  emptyText: {
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    backgroundColor: "#333",
    color: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  daysTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 8,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  dayButton: {
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 4,
  },
  selectedDay: {
    backgroundColor: "#35AAFF",
  },
  dayText: {
    color: "#FFFFFF",
  },
  submitButton: {
    backgroundColor: "#35AAFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default RequestTrainerScreen

