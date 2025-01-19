import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { obterExerciciosPorPlanoId } from '../services/api';

const WorkoutPlanDetailScreen = ({ route, navigation }) => {
  const { planId, planName, creatorName, dayName, creationDate } = route.params;
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obterExerciciosPorPlanoId(planId);
      setExercises(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
      setError('Não foi possível carregar os exercícios');
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const renderExerciseList = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#35AAFF" style={styles.loader} />;
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadExercises}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!exercises || exercises.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum exercício encontrado para este treino</Text>
        </View>
      );
    }

    return exercises.map((exercise, index) => (
      <View key={index} style={styles.exerciseCard}>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>
            {exercise.exercicio?.nome || exercise.nome || 'Exercício sem nome'}
          </Text>
          {exercise.exercicio?.musculoAlvo && (
            <Text style={styles.muscleTarget}>
              Músculo: {exercise.exercicio.musculoAlvo}
            </Text>
          )}
          <Text style={styles.duration}>
            Duração: {exercise.duracao} minutos
          </Text>
          {exercise.exercicio?.descricao && (
            <Text style={styles.description}>
              {exercise.exercicio.descricao}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => navigation.navigate('ExerciseDetail', {
            exerciseId: exercise.exercicio?.id || exercise.id
          })}
        >
          <Icon name="info" size={24} color="#35AAFF" />
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes do Treino</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.planInfo}>
          <Text style={styles.planName}>{planName || 'Plano sem nome'}</Text>
          <Text style={styles.planDetail}>Criado por: {creatorName || 'Desconhecido'}</Text>
          <Text style={styles.planDetail}>Dia: {dayName || 'Não definido'}</Text>
          {creationDate && (
            <Text style={styles.planDetail}>
              Criado em: {formatDate(creationDate)}
            </Text>
          )}
        </View>

        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercícios</Text>
          {renderExerciseList()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  planInfo: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  planDetail: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 8,
  },
  exercisesSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  exerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  muscleTarget: {
    fontSize: 14,
    color: '#35AAFF',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#999999',
    marginTop: 4,
  },
  infoButton: {
    padding: 8,
  },
  loader: {
    marginTop: 32,
  },
  errorContainer: {
    alignItems: 'center',
    marginTop: 32,
    padding: 16,
  },
  errorText: {
    color: '#FF5757',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#35AAFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 32,
    padding: 16,
  },
  emptyText: {
    color: '#999999',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default WorkoutPlanDetailScreen;

