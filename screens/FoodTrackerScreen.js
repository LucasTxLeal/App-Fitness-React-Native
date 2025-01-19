import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { 
  obterRefeicoesDiarias, 
  obterResumoDiario, 
  definirMetaCalorias, 
  registrarRefeicao,
  deletarRefeicao,
  atualizarRefeicao,
} from '../services/api';

const MEAL_TYPES = {
  BREAKFAST: 1,
  LUNCH: 2,
  DINNER: 3,
  SNACKS: 4,
};

const dayTranslations = {
  'Sun': 'Dom',
  'Mon': 'Seg',
  'Tue': 'Ter',
  'Wed': 'Qua',
  'Thu': 'Qui',
  'Fri': 'Sex',
  'Sat': 'Sáb',
  'Sunday': 'Domingo',
  'Monday': 'Segunda',
  'Tuesday': 'Terça',
  'Wednesday': 'Quarta',
  'Thursday': 'Quinta',
  'Friday': 'Sexta',
  'Saturday': 'Sábado'
};

const FoodTrackerScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [meals, setMeals] = useState({});
  const [dailyStats, setDailyStats] = useState({
    totalCalories: 0,
    remainingCalories: 0,
    macros: {
      protein: 0,
      carbs: 0,
      fat: 0,
    },
  });
  const [calorieGoal, setCalorieGoal] = useState(2500);
  const [showCalorieGoalModal, setShowCalorieGoalModal] = useState(false);
  const [tempCalorieGoal, setTempCalorieGoal] = useState('2500');
  const [editingFood, setEditingFood] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState('');

  const loadMeals = useCallback(async () => {
    try {
      const dateKey = selectedDate.toISOString().split('T')[0];
      const mealsResponse = await obterRefeicoesDiarias(dateKey);
    
      if (mealsResponse && mealsResponse.refeicoes) {
        const organizedMeals = {
          [MEAL_TYPES.BREAKFAST]: [],
          [MEAL_TYPES.LUNCH]: [],
          [MEAL_TYPES.DINNER]: [],
          [MEAL_TYPES.SNACKS]: [],
        };
      
        mealsResponse.refeicoes.forEach(meal => {
          if (organizedMeals[meal.tipo_id] && meal.alimento) {
            const quantidade = parseFloat(meal.quantidade_gramas);
            const caloriasPor100g = parseFloat(meal.alimento.calorias);
            const caloriasTotal = (caloriasPor100g * quantidade) / 100;

            organizedMeals[meal.tipo_id].push({
              id: meal.id,
              nome_alimento: meal.alimento.nome_alimento,
              quantidade_gramas: quantidade,
              calorias: caloriasTotal,
              proteinas: (meal.alimento.proteinas * quantidade) / 100,
              gorduras: (meal.alimento.gorduras * quantidade) / 100,
              carboidratos: (meal.alimento.carboidratos * quantidade) / 100,
            });
          }
        });
      
        setMeals(organizedMeals);
      } else {
        console.warn('Invalid or empty meals response:', mealsResponse);
        setMeals({});
      }

      const summaryResponse = await obterResumoDiario(dateKey);
    
      if (summaryResponse && summaryResponse.resumo) {
        setDailyStats({
          totalCalories: Math.round(parseFloat(summaryResponse.resumo.calorias) || 0),
          remainingCalories: Math.round(calorieGoal - (parseFloat(summaryResponse.resumo.calorias) || 0)),
          macros: {
            protein: Math.round(parseFloat(summaryResponse.resumo.proteinas) || 0),
            carbs: Math.round(parseFloat(summaryResponse.resumo.carboidratos) || 0),
            fat: Math.round(parseFloat(summaryResponse.resumo.gorduras) || 0),
          },
        });
      } else {
        console.warn('Invalid or empty summary response:', summaryResponse);
        setDailyStats({
          totalCalories: 0,
          remainingCalories: calorieGoal,
          macros: { protein: 0, carbs: 0, fat: 0 },
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados. Por favor, tente novamente.');
      setMeals({});
      setDailyStats({
        totalCalories: 0,
        remainingCalories: calorieGoal,
        macros: { protein: 0, carbs: 0, fat: 0 },
      });
    }
  }, [selectedDate, calorieGoal]);

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [loadMeals])
  );

  const handleAddFood = (mealType) => {
    navigation.navigate('FoodSearchScreen', {
      mealType,
      date: selectedDate.toISOString().split('T')[0],
    });
  };

  const handleEditFood = (food) => {
    setEditingFood(food);
    setEditingQuantity(food.quantidade_gramas.toString());
  };

  const handleUpdateFood = async () => {
    if (!editingFood) return;

    const newQuantity = parseFloat(editingQuantity);
    if (isNaN(newQuantity) || newQuantity <= 0) {
      Alert.alert('Erro', 'Por favor, insira uma quantidade válida.');
      return;
    }

    try {
      await atualizarRefeicao(editingFood.id, {
        quantidade_gramas: newQuantity,
      });
      setEditingFood(null);
      loadMeals();
    } catch (error) {
      console.error('Erro ao atualizar alimento:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o alimento. Por favor, tente novamente.');
    }
  };

  const handleRemoveFood = async (mealId) => {
    try {
      await deletarRefeicao(mealId);
      setEditingFood(null);
      loadMeals();
    } catch (error) {
      console.error('Erro ao remover alimento:', error);
      Alert.alert('Erro', 'Não foi possível remover o alimento. Por favor, tente novamente.');
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleSaveCalorieGoal = async () => {
    const newGoal = parseInt(tempCalorieGoal);
    if (isNaN(newGoal) || newGoal <= 0) {
      Alert.alert('Erro', 'Por favor, insira uma meta de calorias válida.');
      return;
    }
    try {
      await definirMetaCalorias({
        meta_calorias: newGoal,
        data_registro: selectedDate.toISOString().split('T')[0],
      });
      setCalorieGoal(newGoal);
      setShowCalorieGoalModal(false);
      loadMeals();
    } catch (error) {
      console.error('Erro ao atualizar meta de calorias:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a meta de calorias.');
    }
  };

  const renderMealSection = (title, mealType) => {
    const mealItems = meals[mealType] || [];
    return (
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

        {mealItems.map((food) => (
          <TouchableOpacity
            key={food.id} 
            style={styles.foodItem}
            onPress={() => handleEditFood(food)}
          >
            <View style={styles.foodItemContent}>
              <Text style={styles.foodName}>{food.nome_alimento}</Text>
              <View style={styles.foodDetails}>
                <Text style={styles.foodQuantity}>{food.quantidade_gramas.toFixed(0)}g</Text>
                <Text style={styles.foodCalories}>{Math.round(food.calorias)} cal</Text>
              </View>
              <View style={styles.macroDetails}>
                <Text style={styles.macroText}>P: {food.proteinas.toFixed(1)}g</Text>
                <Text style={styles.macroText}>C: {food.carboidratos.toFixed(1)}g</Text>
                <Text style={styles.macroText}>G: {food.gorduras.toFixed(1)}g</Text>
              </View>
            </View>
            <Icon name="edit-2" size={16} color="#35AAFF" />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const formatDate = (date) => {
    const parts = date.toDateString().split(' ');
    return parts.map(part => dayTranslations[part] || part).join(' ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.datePickerButton} 
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
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
          <Text style={styles.statsTitle}>Resumo Diário</Text>
          <View style={styles.calorieInfo}>
            <TouchableOpacity 
              style={styles.calorieGoalButton}
              onPress={() => {
                setTempCalorieGoal(calorieGoal.toString());
                setShowCalorieGoalModal(true);
              }}
            >
              <Text style={styles.calorieText}>
                Meta: {calorieGoal} cal
              </Text>
              <Icon name="edit-2" size={16} color="#35AAFF" />
            </TouchableOpacity>
            <Text style={styles.calorieText}>
              Consumidas: {Math.round(dailyStats.totalCalories)} cal
            </Text>
            <Text style={[
              styles.calorieText,
              { color: dailyStats.remainingCalories < 0 ? '#FF3B30' : '#4CD964' }
            ]}>
              Restantes: {Math.round(dailyStats.remainingCalories)} cal
            </Text>
          </View>
          <View style={styles.macroContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Proteínas</Text>
              <Text style={styles.macroValue}>
                {Math.round(dailyStats.macros.protein)}g
              </Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Carboidratos</Text>
              <Text style={styles.macroValue}>
                {Math.round(dailyStats.macros.carbs)}g
              </Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroLabel}>Gorduras</Text>
              <Text style={styles.macroValue}>
                {Math.round(dailyStats.macros.fat)}g
              </Text>
            </View>
          </View>
        </View>

        {renderMealSection('Café da Manhã', MEAL_TYPES.BREAKFAST)}
        {renderMealSection('Almoço', MEAL_TYPES.LUNCH)}
        {renderMealSection('Jantar', MEAL_TYPES.DINNER)}
        {renderMealSection('Lanches', MEAL_TYPES.SNACKS)}
      </ScrollView>

      <Modal
        visible={showCalorieGoalModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Meta de Calorias</Text>
            <TextInput
              style={styles.input}
              value={tempCalorieGoal}
              onChangeText={setTempCalorieGoal}
              keyboardType="numeric"
              placeholder="Digite a meta de calorias"
              placeholderTextColor="#666"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveCalorieGoal}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setShowCalorieGoalModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={!!editingFood}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Alimento</Text>
              <TouchableOpacity onPress={() => setEditingFood(null)}>
                <Icon name="x" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalFoodInfo}>
              <Text style={styles.modalFoodName}>{editingFood?.nome_alimento}</Text>
              <View style={styles.modalFoodStats}>
                <Text style={styles.modalFoodCalories}>
                  {Math.round(editingFood?.calorias || 0)} calorias
                </Text>
                <Text style={styles.modalFoodMacros}>
                  P: {Math.round(editingFood?.proteinas || 0)}g | 
                  C: {Math.round(editingFood?.carboidratos || 0)}g | 
                  G: {Math.round(editingFood?.gorduras || 0)}g
                </Text>
              </View>
            </View>

            <Text style={styles.inputLabel}>Quantidade (g)</Text>
            <TextInput
              style={styles.input}
              value={editingQuantity}
              onChangeText={setEditingQuantity}
              keyboardType="numeric"
              placeholder="Digite a quantidade em gramas"
              placeholderTextColor="#666"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateFood}>
              <Text style={styles.saveButtonText}>Atualizar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.removeButton} 
              onPress={() => handleRemoveFood(editingFood.id)}
            >
              <Text style={styles.removeButtonText}>Remover</Text>
            </TouchableOpacity>
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
    flexDirection: 'column',
    marginBottom: 16,
  },
  calorieText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  calorieGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#444',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#262626',
    borderRadius: 8,
    padding: 12,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
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
  foodItemContent: {
    flex: 1,
    marginRight: 8,
  },
  foodName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  foodDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodQuantity: {
    color: '#35AAFF',
    fontSize: 14,
    marginRight: 8,
  },
  foodCalories: {
    color: '#999',
    fontSize: 14,
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
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalFoodInfo: {
    backgroundColor: '#262626',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  modalFoodName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalFoodStats: {
    gap: 4,
  },
  modalFoodCalories: {
    color: '#35AAFF',
    fontSize: 16,
  },
  modalFoodMacros: {
    color: '#999',
    fontSize: 14,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#262626',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#35AAFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  macroDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  macroText: {
    color: '#999',
    fontSize: 12,
  },
});

export default FoodTrackerScreen;

