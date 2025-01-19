import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { obterExerciciosPorTipo } from '../services/api';

// Hardcoded exercise types
const EXERCISE_TYPES = [
  { id: 1, nome: 'Peito' },
  { id: 2, nome: 'Bíceps' },
  { id: 3, nome: 'Costas' },
  { id: 4, nome: 'Cardio' },
  { id: 5, nome: 'Perna' },
  { id: 6, nome: 'Ombros' },
  { id: 7, nome: 'Tríceps' },
  { id: 8, nome: 'Abdômen' },
];

const ExerciseScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedType) {
      loadExercises();
    }
  }, [selectedType]);

  const loadExercises = async () => {
    if (!selectedType) return;
    try {
      setLoading(true);
      const data = await obterExerciciosPorTipo(selectedType);
      setExercises(data || []);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(exercise =>
    exercise.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exercícios</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar exercício..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.typeGroupsContainer}
      >
        {EXERCISE_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeButton,
              selectedType === type.id && styles.selectedType,
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <Text
              style={[
                styles.typeText,
                selectedType === type.id && styles.selectedTypeText,
              ]}
            >
              {type.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#35AAFF" style={styles.loader} />
      ) : (
        <ScrollView style={styles.exerciseList}>
          {filteredExercises.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseItem}
              onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: exercise.id })}
            >
              <View>
                <Text style={styles.exerciseName}>{exercise.nome}</Text>
                <Text style={styles.exerciseDescription} numberOfLines={2}>
                  {exercise.descricao}
                </Text>
                <Text style={styles.muscleTarget}>
                  Músculo: {exercise.musculoAlvo}
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color="#35AAFF" />
            </TouchableOpacity>
          ))}
          {selectedType && filteredExercises.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Nenhum exercício encontrado para este tipo
              </Text>
            </View>
          )}
          {!selectedType && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Selecione um tipo de exercício para ver os exercícios
              </Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 16,
  },
  typeGroupsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#333',
    borderRadius: 20,
    marginRight: 8,
    marginVertical: 8,
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
  exerciseList: {
    flex: 1,
    padding: 16,
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
  exerciseDescription: {
    fontSize: 14,
    color: '#999',
    maxWidth: '90%',
    marginBottom: 4,
  },
  muscleTarget: {
    fontSize: 12,
    color: '#35AAFF',
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
    padding: 20,
  },
  emptyStateText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ExerciseScreen;

