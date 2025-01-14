import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';

const WORKOUT_TYPES = [
  {
    id: 'back',
    name: 'Back',
    exercises: [
      { id: 'pullups', name: 'Pull-ups', description: 'Basic back exercise targeting upper back and lats' },
      { id: 'rows', name: 'Barbell Rows', description: 'Compound movement for overall back development' },
      { id: 'latpulldown', name: 'Lat Pulldown', description: 'Machine exercise focusing on lats' },
    ]
  },
  {
    id: 'chest',
    name: 'Chest',
    exercises: [
      { id: 'benchpress', name: 'Bench Press', description: 'Classic chest exercise for overall development' },
      { id: 'pushups', name: 'Push-ups', description: 'Bodyweight exercise for chest and triceps' },
      { id: 'flyes', name: 'Dumbbell Flyes', description: 'Isolation exercise for chest' },
    ]
  },
  {
    id: 'legs',
    name: 'Legs',
    exercises: [
      { id: 'squats', name: 'Squats', description: 'Fundamental leg exercise' },
      { id: 'lunges', name: 'Lunges', description: 'Unilateral leg exercise' },
      { id: 'legpress', name: 'Leg Press', description: 'Machine-based compound leg exercise' },
    ]
  },
  // Add more workout types as needed
];

const CreateWorkoutPlanScreen = ({ route, navigation }) => {
  const { day, dayId, onSave } = route.params;
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState({});
  const [workoutNotes, setWorkoutNotes] = useState({});

  const handleWorkoutSelect = (workoutType) => {
    if (!selectedExercises[workoutType.id]) {
      setSelectedExercises(prev => ({
        ...prev,
        [workoutType.id]: []
      }));
      setSelectedWorkouts(prev => [...prev, workoutType]);
    }
  };

  const handleExerciseSelect = (workoutId, exercise) => {
    setSelectedExercises(prev => ({
      ...prev,
      [workoutId]: prev[workoutId].includes(exercise)
        ? prev[workoutId].filter(e => e.id !== exercise.id)
        : [...prev[workoutId], exercise]
    }));
  };

  const handleSave = () => {
    const workoutPlan = selectedWorkouts.map(workout => ({
      id: workout.id,
      name: workout.name,
      exercises: selectedExercises[workout.id],
      notes: workoutNotes[workout.id] || ''
    }));
    
    onSave(workoutPlan);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Workout Plan</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.dayTitle}>{day}</Text>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Workouts</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {WORKOUT_TYPES.map((workout) => (
              <TouchableOpacity
                key={workout.id}
                style={[
                  styles.workoutType,
                  selectedWorkouts.includes(workout) && styles.selectedWorkoutType
                ]}
                onPress={() => handleWorkoutSelect(workout)}
              >
                <Text style={[
                  styles.workoutTypeText,
                  selectedWorkouts.includes(workout) && styles.selectedWorkoutTypeText
                ]}>
                  {workout.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {selectedWorkouts.map((workout) => (
          <View key={workout.id} style={styles.workoutSection}>
            <Text style={styles.workoutTitle}>{workout.name}</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add notes for this workout..."
              placeholderTextColor="#666"
              value={workoutNotes[workout.id]}
              onChangeText={(text) => setWorkoutNotes(prev => ({
                ...prev,
                [workout.id]: text
              }))}
              multiline
            />
            {workout.exercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={[
                  styles.exerciseItem,
                  selectedExercises[workout.id]?.includes(exercise) && 
                  styles.selectedExercise
                ]}
                onPress={() => handleExerciseSelect(workout.id, exercise)}
              >
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseDescription}>
                    {exercise.description}
                  </Text>
                </View>
                {selectedExercises[workout.id]?.includes(exercise) && (
                  <Icon name="check" size={20} color="#35AAFF" />
                )}
              </TouchableOpacity>
            ))}
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
  saveButton: {
    color: '#35AAFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  workoutType: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedWorkoutType: {
    backgroundColor: '#35AAFF',
  },
  workoutTypeText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedWorkoutTypeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  workoutSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  workoutTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  notesInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    marginBottom: 16,
    minHeight: 80,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  selectedExercise: {
    borderColor: '#35AAFF',
    borderWidth: 1,
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 8,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exerciseDescription: {
    color: '#999',
    fontSize: 14,
  },
});

export default CreateWorkoutPlanScreen;

