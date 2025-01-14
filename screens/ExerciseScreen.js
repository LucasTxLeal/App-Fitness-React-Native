import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';

const exercises = [
  { 
    id: '1', 
    name: 'Push-ups', 
    description: 'A classic upper body exercise that targets your chest, shoulders, and triceps.',
    image: 'https://example.com/pushups.jpg',
    difficulty: 'Intermediate',
    equipment: 'None',
    muscles: ['Chest', 'Shoulders', 'Triceps']
  },
  { 
    id: '2', 
    name: 'Squats', 
    description: 'A fundamental lower body exercise that works your quads, hamstrings, and glutes.',
    image: 'https://example.com/squats.jpg',
    difficulty: 'Beginner',
    equipment: 'None',
    muscles: ['Quadriceps', 'Hamstrings', 'Glutes']
  },
  { 
    id: '3', 
    name: 'Plank', 
    description: 'An isometric core exercise that improves your stability and posture.',
    image: 'https://example.com/plank.jpg',
    difficulty: 'Beginner',
    equipment: 'None',
    muscles: ['Core', 'Shoulders', 'Back']
  },
];

const ExerciseScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercises</Text>
      </View>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.exerciseItem}
            onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
          >
            <Image source={{ uri: item.image }} style={styles.exerciseImage} />
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              <Text style={styles.exerciseDifficulty}>{item.difficulty}</Text>
              <Text style={styles.exerciseMuscles}>{item.muscles.join(', ')}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#35AAFF" />
          </TouchableOpacity>
        )}
      />
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
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exerciseDifficulty: {
    color: '#35AAFF',
    fontSize: 14,
    marginBottom: 2,
  },
  exerciseMuscles: {
    color: '#999',
    fontSize: 12,
  },
});

export default ExerciseScreen;

