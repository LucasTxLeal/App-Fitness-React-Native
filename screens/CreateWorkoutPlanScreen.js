import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { obterExerciciosPorTipo, criarNovoPlanoTreino } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hardcoded exercise types matching the ExerciseScreen
const EXERCISE_TYPES = [
  { id: 1, nome: 'Peito' },
  { id: 2, nome: 'Costas' },
  { id: 3, nome: 'Pernas' },
  { id: 4, nome: 'Ombros' },
  { id: 5, nome: 'Bíceps' },
  { id: 6, nome: 'Tríceps' },
  { id: 7, nome: 'Abdômen' },
  { id: 8, nome: 'Cardio' },
];

const DAYS_OF_WEEK = [
  { id: 1, name: 'Domingo', short: 'D' },
  { id: 2, name: 'Segunda', short: 'S' },
  { id: 3, name: 'Terça', short: 'T' },
  { id: 4, name: 'Quarta', short: 'W' },
  { id: 5, name: 'Quinta', short: 'T' },
  { id: 6, name: 'Sexta', short: 'F' },
  { id: 7, name: 'Sábado', short: 'S' },
];

const CreateWorkoutPlanScreen = ({ navigation, route }) => {
  const { contaId } = route.params;
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [exercises, setExercises] = useState({});
  const [selectedExercises, setSelectedExercises] = useState({});
  const [loading, setLoading] = useState(false);
  const [planName, setPlanName] = useState('');
  const [exerciseDurations, setExerciseDurations] = useState({});
  const [userId, setUserId] = useState(null);

  const [durationModalVisible, setDurationModalVisible] = useState(false);
  const [tempDuration, setTempDuration] = useState('');
  const [selectedExerciseForDuration, setSelectedExerciseForDuration] = useState(null);

  useEffect(() => {
    getUserId();
  }, []);

  const getUserId = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const loadExercisesForType = async (typeId) => {
    try {
      setLoading(true);
      const exercicios = await obterExerciciosPorTipo(typeId);
      setExercises(prev => ({
        ...prev,
        [typeId]: exercicios || []
      }));
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
      Alert.alert('Erro', 'Não foi possível carregar os exercícios');
    } finally {
      setLoading(false);
    }
  };

  const handleDaySelect = (dayId) => {
    setSelectedDay(dayId);
  };

  const handleTypeSelect = (typeId) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(prev => prev.filter(id => id !== typeId));
      setSelectedExercises(prev => {
        const newExercises = { ...prev };
        delete newExercises[typeId];
        return newExercises;
      });
    } else {
      setSelectedTypes(prev => [...prev, typeId]);
      loadExercisesForType(typeId);
    }
  };

  const handleExerciseSelect = (typeId, exerciseId) => {
    setSelectedExercises(prev => {
      const updatedExercises = { ...prev };
      if (!updatedExercises[typeId]) {
        updatedExercises[typeId] = [];
      }
      const index = updatedExercises[typeId].indexOf(exerciseId);
      if (index > -1) {
        updatedExercises[typeId].splice(index, 1);
        const newDurations = { ...exerciseDurations };
        delete newDurations[`${typeId}-${exerciseId}`];
        setExerciseDurations(newDurations);
      } else {
        updatedExercises[typeId].push(exerciseId);
        setSelectedExerciseForDuration({ typeId, exerciseId });
        setTempDuration('');
        setDurationModalVisible(true);
      }
      return updatedExercises;
    });
  };

  const handleDurationSubmit = () => {
    const duration = parseInt(tempDuration, 10);
    if (isNaN(duration) || duration <= 0) {
      Alert.alert('Erro', 'Por favor, insira uma duração válida em minutos');
      return;
    }

    setExerciseDurations(prev => ({
      ...prev,
      [`${selectedExerciseForDuration.typeId}-${selectedExerciseForDuration.exerciseId}`]: duration
    }));
    setDurationModalVisible(false);
    setSelectedExerciseForDuration(null);
    setTempDuration('');
  };

  const handleCreatePlan = async () => {
    if (!planName.trim()) {
      Alert.alert('Erro', 'Por favor, insira um nome para o plano de treino');
      return;
    }

    if (!selectedDay) {
      Alert.alert('Erro', 'Selecione um dia da semana');
      return;
    }

    if (selectedTypes.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um tipo de treino');
      return;
    }

    const hasExercises = selectedTypes.every(typeId => 
      selectedExercises[typeId] && selectedExercises[typeId].length > 0
    );

    if (!hasExercises) {
      Alert.alert('Erro', 'Selecione pelo menos um exercício para cada tipo de treino');
      return;
    }

    const allExercisesHaveDuration = selectedTypes.every(typeId =>
      selectedExercises[typeId].every(exerciseId =>
        exerciseDurations[`${typeId}-${exerciseId}`]
      )
    );

    if (!allExercisesHaveDuration) {
      Alert.alert('Erro', 'Todos os exercícios precisam ter uma duração definida');
      return;
    }

    try {
      setLoading(true);

      // Format the data according to the database schema and controller expectations
      const planData = {
        nomePlano: planName.trim(),
        contaId: parseInt(contaId, 10),
        diaSemanaId: selectedDay,
        tiposDeTreino: selectedTypes.map(tipoId => ({
          tipo_id: tipoId,
          exercicios: selectedExercises[tipoId].map(exercicioId => ({
            exercicio_id: exercicioId,
            duracao: exerciseDurations[`${tipoId}-${exercicioId}`]
          }))
        }))
      };

      console.log('Dados do plano a serem enviados:', JSON.stringify(planData, null, 2));

      const response = await criarNovoPlanoTreino(planData);
      console.log('Resposta do servidor:', response);

      Alert.alert(
        'Sucesso',
        'Plano de treino criado com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      Alert.alert(
        'Erro',
        'Não foi possível criar o plano de treino. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.title}>Criar Plano de Treino</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Nome do Plano</Text>
        <TextInput
          style={styles.input}
          value={planName}
          onChangeText={setPlanName}
          placeholder="Digite o nome do plano"
          placeholderTextColor="#999"
        />

        <Text style={styles.sectionTitle}>Dia da Semana</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.daysContainer}
        >
          {DAYS_OF_WEEK.map((day) => (
            <TouchableOpacity
              key={day.id}
              style={[
                styles.dayButton,
                selectedDay === day.id && styles.selectedDay
              ]}
              onPress={() => handleDaySelect(day.id)}
            >
              <Text style={[
                styles.dayText,
                selectedDay === day.id && styles.selectedDayText
              ]}>
                {day.short}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Tipos de Treino</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.typesContainer}
        >
          {EXERCISE_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeButton,
                selectedTypes.includes(type.id) && styles.selectedType
              ]}
              onPress={() => handleTypeSelect(type.id)}
            >
              <Text style={[
                styles.typeText,
                selectedTypes.includes(type.id) && styles.selectedTypeText
              ]}>
                {type.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedTypes.map((typeId) => (
          <View key={typeId} style={styles.exercisesSection}>
            <Text style={styles.exercisesSectionTitle}>
              {EXERCISE_TYPES.find(t => t.id === typeId)?.nome}
            </Text>
            {loading ? (
              <ActivityIndicator size="large" color="#35AAFF" />
            ) : (
              <View style={styles.exercisesList}>
                {exercises[typeId] && exercises[typeId].map((exercise) => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={[
                      styles.exerciseItem,
                      selectedExercises[typeId]?.includes(exercise.id) && 
                      styles.selectedExercise
                    ]}
                    onPress={() => handleExerciseSelect(typeId, exercise.id)}
                  >
                    <View>
                      <Text style={styles.exerciseName}>{exercise.nome}</Text>
                      <Text style={styles.exerciseTarget}>
                        {exercise.musculoAlvo}
                      </Text>
                      {selectedExercises[typeId]?.includes(exercise.id) && (
                        <Text style={styles.exerciseDuration}>
                          Duração: {exerciseDurations[`${typeId}-${exercise.id}`] || 'Não definida'} min
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.createButton}
          onPress={handleCreatePlan}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.createButtonText}>Criar Plano</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Duration Input Modal */}
      <Modal
        visible={durationModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setDurationModalVisible(false);
          if (selectedExerciseForDuration) {
            setSelectedExercises(prev => ({
              ...prev,
              [selectedExerciseForDuration.typeId]: prev[selectedExerciseForDuration.typeId]
                .filter(id => id !== selectedExerciseForDuration.exerciseId)
            }));
          }
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Definir Duração</Text>
            <Text style={styles.modalSubtitle}>
              Digite a duração do exercício em minutos
            </Text>
            <TextInput
              style={styles.modalInput}
              value={tempDuration}
              onChangeText={setTempDuration}
              keyboardType="numeric"
              placeholder="Ex: 30"
              placeholderTextColor="#666"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setDurationModalVisible(false);
                  if (selectedExerciseForDuration) {
                    setSelectedExercises(prev => ({
                      ...prev,
                      [selectedExerciseForDuration.typeId]: prev[selectedExerciseForDuration.typeId]
                        .filter(id => id !== selectedExerciseForDuration.exerciseId)
                    }));
                  }
                }}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDurationSubmit}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#333',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
  typesContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
    marginRight: 8,
  },
  selectedType: {
    backgroundColor: '#35AAFF',
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  selectedTypeText: {
    fontWeight: 'bold',
  },
  exercisesSection: {
    marginBottom: 24,
  },
  exercisesSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  exercisesList: {
    gap: 8,
  },
  exerciseItem: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  selectedExercise: {
    backgroundColor: '#2A4D69',
    borderColor: '#35AAFF',
    borderWidth: 1,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exerciseTarget: {
    color: '#999999',
    fontSize: 14,
  },
  exerciseDuration: {
    color: '#35AAFF',
    fontSize: 12,
    marginTop: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  createButton: {
    backgroundColor: '#35AAFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#262626',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#444',
  },
  confirmButton: {
    backgroundColor: '#35AAFF',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateWorkoutPlanScreen;

