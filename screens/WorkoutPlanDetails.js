import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { getTiposDeTreinoPorPlanoId, getExerciciosPorPlanoId, excluirPlanoDeTreino } from '../services/api';

const WorkoutPlanDetails = ({ route, navigation }) => {
  const { planId } = route.params;
  const [tiposTreino, setTiposTreino] = useState([]);
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlanDetails();
  }, []);

  const fetchPlanDetails = async () => {
    try {
      const [tiposResponse, exerciciosResponse] = await Promise.all([
        getTiposDeTreinoPorPlanoId(planId),
        getExerciciosPorPlanoId(planId)
      ]);
      setTiposTreino(tiposResponse);
      setExercicios(exerciciosResponse);
    } catch (error) {
      console.error('Erro ao buscar detalhes do plano:', error);
      // Adicione um feedback visual para o usuário aqui
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async () => {
    try {
      await excluirPlanoDeTreino(planId);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao excluir plano:', error);
      // Adicione um feedback visual para o usuário aqui
    }
  };

  const renderExercicio = ({ item }) => (
    <View style={styles.exercicioItem}>
      <Text style={styles.exercicioNome}>{item.exercicio.nome}</Text>
      <Text style={styles.exercicioDuracao}>{item.duracao} min</Text>
    </View>
  );

  const renderTipoTreino = ({ item }) => (
    <View style={styles.tipoTreinoContainer}>
      <Text style={styles.tipoTreinoNome}>{item.tipoDeTreino.nome}</Text>
      <FlatList
        data={exercicios.filter(ex => ex.exercicio.tipoDeTreinoId === item.tipoDeTreino.id)}
        renderItem={renderExercicio}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#35AAFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes do Plano</Text>
        <TouchableOpacity onPress={handleDeletePlan}>
          <Icon name="trash-2" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tiposTreino}
        renderItem={renderTipoTreino}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum tipo de treino encontrado.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191919',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tipoTreinoContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#333',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  tipoTreinoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  exercicioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  exercicioNome: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  exercicioDuracao: {
    fontSize: 14,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});

export default WorkoutPlanDetails;

