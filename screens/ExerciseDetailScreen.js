import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { obterExerciciosPorTipo, obterTiposExercicios } from '../services/api';

const ExerciseScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [exerciseTypes, setExerciseTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar tipos de exercícios
  const loadExerciseTypes = async () => {
    try {
      setLoading(true);
      const types = await obterTiposExercicios();
      console.log('Tipos carregados:', types);
      setExerciseTypes(types);
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar tipos de exercícios:', error);
      setError('Não foi possível carregar os tipos de exercícios.');
      setExerciseTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExerciseTypes();
  }, []);

  // Carregar exercícios quando um tipo é selecionado
  const loadExercises = async () => {
    try {
      setLoading(true);
      const data = await obterExerciciosPorTipo(selectedType);
      console.log('Exercícios carregados:', data.exercicios);
      setExercises(data.exercicios || []);
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
      setError('Não foi possível carregar os exercícios. Por favor, tente novamente.');
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedType) {
      loadExercises();
    } else {
      setExercises([]);
    }
  }, [selectedType]);

  const filteredExercises = exercises.filter(exercise =>
    exercise.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTypeSelect = (typeId) => {
    setSelectedType(prevSelected => prevSelected === typeId ? null : typeId);
  };

  const handleRetry = () => {
    if (exerciseTypes.length === 0) {
      loadExerciseTypes();
    } else {
      loadExercises();
    }
  };

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

      {loading && exerciseTypes.length === 0 ? (
        <ActivityIndicator size="large" color="#35AAFF" style={styles.loader} />
      ) : error && exerciseTypes.length === 0 ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={handleRetry}
          >
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.typeGroupsContainer}
          >
            {exerciseTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeButton,
                  selectedType === type.id && styles.selectedType,
                ]}
                onPress={() => handleTypeSelect(type.id)}
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
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton} 
                onPress={handleRetry}
              >
                <Text style={styles.retryButtonText}>Tentar Novamente</Text>
              </TouchableOpacity>
            </View>
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
        </>
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
    margin: 16,
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
    marginBottom: 16,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#333',
    borderRadius: 20,
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#35AAFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExerciseScreen;

