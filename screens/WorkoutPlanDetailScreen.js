import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';

const WorkoutPlanDetailScreen = ({ route, navigation }) => {
  const { day, workouts } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{day}'s Workout</Text>
        <TouchableOpacity>
          <Icon name="edit-2" size={24} color="#35AAFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {workouts.map((workout, index) => (
          <View key={index} style={styles.workoutSection}>
            <Text style={styles.workoutTitle}>{workout.name}</Text>
            {workout.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesLabel}>Notes:</Text>
                <Text style={styles.notesText}>{workout.notes}</Text>
              </View>
            )}
            <View style={styles.exercisesList}>
              {workout.exercises.map((exercise, exerciseIndex) => (
                <View key={exerciseIndex} style={styles.exerciseItem}>
                  <View style={styles.exerciseHeader}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <TouchableOpacity>
                      <Icon name="info" size={20} color="#35AAFF" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.exerciseDescription}>
                    {exercise.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  workoutSection: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  workoutTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notesContainer: {
    backgroundColor: '#262626',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  notesLabel: {
    color: '#35AAFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notesText: {
    color: '#fff',
    fontSize: 14,
  },
  exercisesList: {
    gap: 12,
  },
  exerciseItem: {
    backgroundColor: '#262626',
    borderRadius: 8,
    padding: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseDescription: {
    color: '#999',
    fontSize: 14,
  },
});

export default WorkoutPlanDetailScreen;

