import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { obterPlanosTreino, obterTreinoDoDia, obterExerciciosPorPlanoId } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const DAYS = [
  { id: 1, short: 'D', name: 'Domingo' },
  { id: 2, short: 'S', name: 'Segunda' },
  { id: 3, short: 'T', name: 'Terça' },
  { id: 4, short: 'Q', name: 'Quarta' },
  { id: 5, short: 'Q', name: 'Quinta' },
  { id: 6, short: 'S', name: 'Sexta' },
  { id: 7, short: 'S', name: 'Sábado' },
];

const TrainingScreen = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() + 1);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    loadWorkoutPlans();
  }, [selectedDay]);

  const loadWorkoutPlans = async () => {
    try {
      setLoading(true);
      const response = await obterTreinoDoDia(selectedDay);
      console.log('Planos de treino recebidos:', response);
      setWorkoutPlans(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Erro ao carregar planos de treino:', error);
      Alert.alert('Erro', 'Não foi possível carregar os planos de treino');
      setWorkoutPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkoutPlan = () => {
    if (userId) {
      navigation.navigate('CreateWorkoutPlan', { contaId: userId });
    } else {
      console.error('ID do usuário não encontrado');
      Alert.alert('Erro', 'Não foi possível criar o plano de treino. Por favor, faça login novamente.');
    }
  };

  const handlePlanPress = (plan) => {
    navigation.navigate('WorkoutPlanDetail', { 
      planId: plan.id,
      planName: plan.nome,
      creatorName: plan.criador?.nome,
      dayName: plan.diaSemana?.nome,
      creationDate: plan.dataCriacao
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Plano de treino</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleCreateWorkoutPlan}
        >
          <Icon name="plus" size={24} color="#35AAFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.daysContainer}>
        {DAYS.map((day) => (
          <TouchableOpacity
            key={day.id}
            style={[styles.dayButton, selectedDay === day.id && styles.selectedDay]}
            onPress={() => setSelectedDay(day.id)}
          >
            <Text style={[styles.dayText, selectedDay === day.id && styles.selectedDayText]}>
              {day.short}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#35AAFF" style={styles.loader} />
      ) : (
        <ScrollView style={styles.content}>
          {workoutPlans.length > 0 ? (
            workoutPlans.map((plan, index) => (
              <TouchableOpacity
                key={plan.id || index}
                style={styles.planCard}
                onPress={() => handlePlanPress(plan)}
              >
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.nome}</Text>
                  <Text style={styles.planCreator}>
                    por {plan.criador?.nome || 'Desconhecido'}
                  </Text>
                </View>
                <View style={styles.planInfo}>
                  <Text style={styles.planDay}>
                    {plan.diaSemana?.nome || DAYS.find(d => d.id === selectedDay)?.name}
                  </Text>
                  <Icon name="chevron-right" size={24} color="#35AAFF" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Nenhum treino programado para {DAYS.find(d => d.id === selectedDay)?.name}
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateWorkoutPlan}
              >
                <Text style={styles.createButtonText}>Criar Treino</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#262626',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  selectedDay: {
    backgroundColor: '#35AAFF',
  },
  dayText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  selectedDayText: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  planCard: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  planHeader: {
    marginBottom: 8,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  planCreator: {
    fontSize: 14,
    color: '#999999',
  },
  planInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  planDay: {
    fontSize: 16,
    color: '#35AAFF',
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#999999',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    color: '#999999',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#35AAFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TrainingScreen;

