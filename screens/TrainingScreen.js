import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';

const DAYS = [
  { id: 0, name: 'S', full: 'Sunday' },
  { id: 1, name: 'M', full: 'Monday' },
  { id: 2, name: 'T', full: 'Tuesday' },
  { id: 3, name: 'W', full: 'Wednesday' },
  { id: 4, name: 'T', full: 'Thursday' },
  { id: 5, name: 'F', full: 'Friday' },
  { id: 6, name: 'S', full: 'Saturday' },
];

const TrainingScreen = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [workoutPlans, setWorkoutPlans] = useState({});

  const handleDayPress = (dayId) => {
    setSelectedDay(dayId);
    if (workoutPlans[dayId]) {
      navigation.navigate('WorkoutPlanDetail', { 
        day: DAYS[dayId].full,
        workouts: workoutPlans[dayId]
      });
    } else {
      navigation.navigate('CreateWorkoutPlan', { 
        day: DAYS[dayId].full,
        dayId: dayId,
        onSave: (workouts) => {
          setWorkoutPlans(prev => ({
            ...prev,
            [dayId]: workouts
          }));
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Training Plan</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateWorkoutPlan', {
            day: DAYS[selectedDay].full,
            dayId: selectedDay,
            onSave: (workouts) => {
              setWorkoutPlans(prev => ({
                ...prev,
                [selectedDay]: workouts
              }));
            }
          })}
        >
          <Icon name="plus" size={24} color="#35AAFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.daysContainer}>
        <Text style={styles.today}>Today</Text>
        <View style={styles.daysRow}>
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day.id}
              style={[
                styles.dayButton,
                selectedDay === day.id && styles.selectedDay,
                workoutPlans[day.id] && styles.hasWorkout
              ]}
              onPress={() => handleDayPress(day.id)}
            >
              <Text style={[
                styles.dayText,
                selectedDay === day.id && styles.selectedDayText
              ]}>
                {day.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {Object.entries(workoutPlans).map(([dayId, workouts]) => (
          <TouchableOpacity
            key={dayId}
            style={styles.planCard}
            onPress={() => navigation.navigate('WorkoutPlanDetail', {
              day: DAYS[Number(dayId)].full,
              workouts
            })}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planDay}>{DAYS[Number(dayId)].full}</Text>
              <Icon name="chevron-right" size={20} color="#666" />
            </View>
            <View style={styles.planContent}>
              {workouts.map((workout, index) => (
                <Text key={index} style={styles.workoutName}>
                  {workout.name} ({workout.exercises.length} exercises)
                </Text>
              ))}
            </View>
          </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  daysContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  today: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: '#35AAFF',
  },
  hasWorkout: {
    borderWidth: 2,
    borderColor: '#35AAFF',
  },
  dayText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  planCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planDay: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  planContent: {
    gap: 4,
  },
  workoutName: {
    color: '#999',
    fontSize: 14,
  },
});

export default TrainingScreen;

