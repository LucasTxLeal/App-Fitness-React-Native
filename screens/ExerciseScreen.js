import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';

const categories = [
  { id: 'biceps', name: 'Bíceps' },
  { id: 'costas', name: 'Costas' },
  { id: 'cardio', name: 'Cardio' },
  { id: 'peito', name: 'Peito' },
  { id: 'pernas', name: 'Pernas' },
  { id: 'ombros', name: 'Ombros' },
  { id: 'triceps', name: 'Tríceps' },
  { id: 'abdomen', name: 'Abdômen' },
];

const exercises = {
  biceps: [
    {
      id: '1',
      name: 'Rosca Direta (Halter)',
      description: 'Execute o movimento controlado, mantendo os cotovelos fixos ao lado do corpo.',
      muscles: ['Bíceps Braquial', 'Braquial'],
      equipment: 'Halteres',
      difficulty: 'Iniciante',
    },
    {
      id: '2',
      name: 'Rosca Martelo',
      description: 'Realize o exercício com pegada neutra, simulando um movimento de martelo.',
      muscles: ['Bíceps Braquial', 'Braquiorradial'],
      equipment: 'Halteres',
      difficulty: 'Iniciante',
    },
    {
      id: '3',
      name: 'Remada Curvada',
      description: 'Mantenha as costas retas e puxe os pesos em direção ao abdômen.',
      muscles: ['Bíceps', 'Costas'],
      equipment: 'Barra ou Halteres',
      difficulty: 'Intermediário',
    },
  ],
  costas: [
    { id: 'c1', name: 'Puxada na Barra Fixa', description: 'Exercício para as costas usando o peso corporal.', muscles: ['Latíssimo do Dorso', 'Bíceps'], equipment: 'Barra Fixa', difficulty: 'Intermediário' },
    { id: 'c2', name: 'Remada Curvada', description: 'Exercício composto para as costas usando barra ou halteres.', muscles: ['Latíssimo do Dorso', 'Trapézio', 'Romboides'], equipment: 'Barra ou Halteres', difficulty: 'Intermediário' },
    { id: 'c3', name: 'Puxada na Máquina', description: 'Exercício para as costas usando máquina de puxada.', muscles: ['Latíssimo do Dorso', 'Bíceps'], equipment: 'Máquina de Puxada', difficulty: 'Iniciante' },
  ],
};

const ExerciseScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('biceps');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises =
    exercises[selectedCategory]?.filter((exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const renderExerciseList = () => {
    if (filteredExercises.length === 0) {
      return (
        <View style={styles.noExercisesContainer}>
          <Text style={styles.noExercisesText}>No exercises found for this category.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.exerciseItem}
            onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
          >
            <View style={styles.exerciseContent}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseDescription}>{item.description.slice(0, 60)}...</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#35AAFF" />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.exerciseList}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar exercício..."
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollView}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {renderExerciseList()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  categoriesContainer: {
    backgroundColor: '#222',
    paddingVertical: 12,
  },
  categoriesScrollView: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#35AAFF',
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedCategoryText: {
    fontWeight: 'bold',
  },
  exerciseList: {
    paddingVertical: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
  },
  exerciseContent: {
    flex: 1,
    marginRight: 16,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exerciseDescription: {
    color: '#aaa',
    fontSize: 14,
  },
  noExercisesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  noExercisesText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ExerciseScreen;

