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
import { obterPlanosTreino, obterTreinoDoDia } from '../services/api';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const TrainingScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkoutPlan();
  }, [selectedDate]);

  const loadWorkoutPlan = async () => {
    try {
      setLoading(true);
      const dateStr = selectedDate.toISOString().split('T')[0];
      const data = await obterTreinoDoDia(dateStr);
      setWorkoutPlan(data);
    } catch (error) {
      console.error('Erro ao carregar plano de treino:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDayButton = (day, index) => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + index);
    const isSelected = selectedDate.toDateString() === date.toDateString();

    return (
      <TouchableOpacity
        key={index}
        style={[styles.dayButton, isSelected && styles.selectedDay]}
        onPress={() => setSelectedDate(date)}
      >
        <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
          {day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Training Plan</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateWorkoutPlan')}
        >
          <Icon name="plus" size={24} color="#35AAFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.daysContainer}>
        {DAYS.map((day, index) => renderDayButton(day, index))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#35AAFF" style={styles.loader} />
      ) : (
        <ScrollView style={styles.content}>
          {workoutPlan?.grupos?.map((grupo, index) => (
            <View key={index} style={styles.workoutGroup}>
              <Text style={styles.groupTitle}>{grupo.nome}</Text>
              {grupo.exercicios.map((exercicio, exercicioIndex) => (
                <TouchableOpacity
                  key={exercicioIndex}
                  style={styles.exerciseItem}
                  onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: exercicio.id })}
                >
                  <View>
                    <Text style={styles.exerciseName}>{exercicio.nome}</Text>
                    <Text style={styles.exerciseDetails}>
                      {exercicio.series}x{exercicio.repeticoes} • {exercicio.peso}kg
                    </Text>
                  </View>
                  <Icon name="info" size={24} color="#35AAFF" />
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {!workoutPlan?.grupos?.length && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Nenhum treino programado para este dia
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('CreateWorkoutPlan')}
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
  workoutGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
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

