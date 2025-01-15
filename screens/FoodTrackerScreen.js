import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { mockApi } from '../services/mockApi';

const MEAL_TYPES = {
  BREAKFAST: 'Café da Manhã',
  LUNCH: 'Almoço',
  DINNER: 'Jantar',
  SNACKS: 'Lanches',
};

const FoodTrackerScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [meals, setMeals] = useState({});
  const [selectedFood, setSelectedFood] = useState(null);
  const [showFoodDetail, setShowFoodDetail] = useState(false);
  const [dailyStats, setDailyStats] = useState({
    totalCalories: 0,
    remainingCalories: 2500,
    macros: {
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  });

  const loadMeals = useCallback(async () => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const entries = await mockApi.getFoodEntries(dateKey);
    setMeals(entries);

    // Calculate daily totals
    let totalCal = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    Object.values(entries).forEach(mealFoods => {
      mealFoods.forEach(food => {
        totalCal += food.calories;
        totalProtein += food.protein;
        totalCarbs += food.carbs;
        totalFat += food.fat;
      });
    });

    setDailyStats({
      totalCalories: totalCal,
      remainingCalories: 2500 - totalCal,
      macros: {
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
      },
    });
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      async function loadMealData() {
        const dateKey = selectedDate.toISOString().split('T')[0];
        const entries = await mockApi.getFoodEntries(dateKey);
        setMeals(entries);

        // Calculate daily totals
        let totalCal = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;

        Object.values(entries).forEach(mealFoods => {
          mealFoods.forEach(food => {
            totalCal += food.calories;
            totalProtein += food.protein;
            totalCarbs += food.carbs;
            totalFat += food.fat;
          });
        });

        setDailyStats({
          totalCalories: totalCal,
          remainingCalories: 2500 - totalCal,
          macros: {
            protein: totalProtein,
            carbs: totalCarbs,
            fat: totalFat,
          },
        });
      }

      loadMealData();
    }, [selectedDate])
  );

  const handleAddFood = (mealType) => {
    navigation.navigate('FoodSearch', {
      mealType,
      date: selectedDate.toISOString().split('T')[0],
    });
  };

  const handleRemoveFood = async (mealType, index) => {
    await mockApi.removeFoodEntry(
      selectedDate.toISOString().split('T')[0],
      mealType,
      index
    );
    loadMeals();
    setShowFoodDetail(false);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const FoodDetailModal = () => (
    <Modal
      visible={showFoodDetail}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFoodDetail(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedFood?.name}</Text>
            <TouchableOpacity onPress={() => setShowFoodDetail(false)}>
              <Icon name="x" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <Text style={styles.nutritionValue}>{selectedFood?.calories}</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>{selectedFood?.protein}g</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Carbs</Text>
              <Text style={styles.nutritionValue}>{selectedFood?.carbs}g</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Fat</Text>
              <Text style={styles.nutritionValue}>{selectedFood?.fat}g</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Amount</Text>
            <Text style={styles.infoText}>{selectedFood?.quantity}g</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Benefits</Text>
            <Text style={styles.infoText}>{selectedFood?.benefits}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Diet Information</Text>
            <Text style={styles.infoText}>{selectedFood?.dietInfo}</Text>
          </View>

          <TouchableOpacity 
            style={styles.removeButton} 
            onPress={() => handleRemoveFood(selectedFood.mealType, selectedFood.index)}
          >
            <Text style={styles.removeButtonText}>Remove Food</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderMealSection = (title, mealType) => (
    <View style={styles.mealSection}>
      <View style={styles.mealHeader}>
        <View style={styles.mealTitleContainer}>
          <Icon 
            name={
              mealType === MEAL_TYPES.BREAKFAST ? 'sun' :
              mealType === MEAL_TYPES.LUNCH ? 'coffee' :
              mealType === MEAL_TYPES.DINNER ? 'moon' : 'package'
            } 
            size={24} 
            color="#35AAFF" 
          />
          <Text style={styles.mealTitle}>{title}</Text>
        </View>
        <TouchableOpacity onPress={() => handleAddFood(mealType)}>
          <Icon name="plus" size={24} color="#35AAFF" />
        </TouchableOpacity>
      </View>

      {meals[mealType]?.map((food, index) => (
        <TouchableOpacity
          key={index}
          style={styles.foodItem}
          onPress={() => {
            setSelectedFood({ ...food, mealType, index });
            setShowFoodDetail(true);
          }}
        >
          <View>
            <Text style={styles.foodName}>{food.name}</Text>
            <Text style={styles.foodQuantity}>{food.quantity}g</Text>
          </View>
          <Text style={styles.foodCalories}>{food.calories} cal</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.datePickerButton} 
        onPress={() => setShowDatePicker(true)}
      >
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

        {renderMealSection(MEAL_TYPES.BREAKFAST, MEAL_TYPES.BREAKFAST)}
        {renderMealSection(MEAL_TYPES.LUNCH, MEAL_TYPES.LUNCH)}
        {renderMealSection(MEAL_TYPES.DINNER, MEAL_TYPES.DINNER)}
        {renderMealSection(MEAL_TYPES.SNACKS, MEAL_TYPES.SNACKS)}
      </ScrollView>

      {selectedFood && <FoodDetailModal />}
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
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  foodName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodQuantity: {
    color: '#35AAFF',
    fontSize: 14,
    marginTop: 4,
  },
  foodCalories: {
    color: '#999',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#191919',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  nutritionItem: {
    width: '50%',
    padding: 10,
  },
  nutritionLabel: {
    color: '#666',
    fontSize: 14,
  },
  nutritionValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
  },
  removeButton: {
    backgroundColor: '#FF375B',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FoodTrackerScreen;

