import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACKS: 'snacks',
};

// This will simulate our "database" for now
let foodEntries = {};

const FoodTrackerScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dailyStats, setDailyStats] = useState({
    totalCalories: 0,
    remainingCalories: 2500,
    macros: {
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  });

  const loadDailyEntries = useCallback(() => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const entries = foodEntries[dateKey] || [];
    
    const totals = entries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fat: acc.fat + entry.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    setDailyStats({
      totalCalories: totals.calories,
      remainingCalories: 2500 - totals.calories,
      macros: {
        protein: totals.protein,
        carbs: totals.carbs,
        fat: totals.fat,
      },
    });
  }, [selectedDate]);

  useFocusEffect(loadDailyEntries);

  const handleAddFood = (mealType) => {
    navigation.navigate('FoodSearch', {
      mealType,
      date: selectedDate.toISOString().split('T')[0],
      onAddFood: (food) => {
        const dateKey = selectedDate.toISOString().split('T')[0];
        if (!foodEntries[dateKey]) {
          foodEntries[dateKey] = [];
        }
        foodEntries[dateKey].push({ ...food, mealType });
        loadDailyEntries();
      },
    });
  };

  const renderMealSection = (title, mealType, iconName) => (
    <TouchableOpacity
      style={styles.mealSection}
      onPress={() => handleAddFood(mealType)}
    >
      <View style={styles.mealHeader}>
        <Icon name={iconName} size={24} color="#35AAFF" />
        <Text style={styles.mealTitle}>{title}</Text>
      </View>
      <Icon name="plus" size={24} color="#35AAFF" />
    </TouchableOpacity>
  );

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
        <Icon name="calendar" size={24} color="#35AAFF" />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <ScrollView style={styles.content}>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Daily Summary</Text>
          <View style={styles.calorieInfo}>
            <Text style={styles.calorieText}>
              Remaining: {Math.round(dailyStats.remainingCalories)} cal
            </Text>
            <Text style={styles.calorieText}>
              Consumed: {Math.round(dailyStats.totalCalories)} cal
            </Text>
          </View>
          <View style={styles.macroContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroValue}>
                {Math.round(dailyStats.macros.protein)}g
              </Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroValue}>
                {Math.round(dailyStats.macros.carbs)}g
              </Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Fat</Text>
              <Text style={styles.macroValue}>
                {Math.round(dailyStats.macros.fat)}g
              </Text>
            </View>
          </View>
        </View>

        {renderMealSection('Breakfast', MEAL_TYPES.BREAKFAST, 'sun')}
        {renderMealSection('Lunch', MEAL_TYPES.LUNCH, 'coffee')}
        {renderMealSection('Dinner', MEAL_TYPES.DINNER, 'moon')}
        {renderMealSection('Snacks', MEAL_TYPES.SNACKS, 'package')}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#333',
  },
  dateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  calorieInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  calorieText: {
    color: '#fff',
    fontSize: 16,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  macroValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealSection: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});

export default FoodTrackerScreen;

