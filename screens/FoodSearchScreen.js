import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { mockApi } from '../services/mockApi';
import { useFocusEffect } from '@react-navigation/native';

const FoodSearchScreen = ({ route, navigation }) => {
  const { mealType, date } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState('100');
  const [showModal, setShowModal] = useState(false);

  const handleAddFood = useCallback((entry) => {
    mockApi.addFoodEntry(date, mealType, entry);
    navigation.goBack();
  }, [date, mealType, navigation]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        onAddFood: handleAddFood,
      });
    }, [navigation, handleAddFood])
  );

  const handleSearch = async (query) => {
    setSearchQuery(query);
    const results = await mockApi.searchFoods(query);
    setSearchResults(results);
  };

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setShowModal(true);
  };

  const handleAddSelectedFood = () => {
    const amount = parseInt(quantity);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    const scaleFactor = amount / selectedFood.portionSize;
    const entry = {
      ...selectedFood,
      quantity: amount,
      calories: Math.round(selectedFood.calories * scaleFactor),
      protein: Math.round(selectedFood.protein * scaleFactor * 10) / 10,
      carbs: Math.round(selectedFood.carbs * scaleFactor * 10) / 10,
      fat: Math.round(selectedFood.fat * scaleFactor * 10) / 10,
    };

    handleAddFood(entry);
    setShowModal(false);
  };

  const FoodDetailModal = () => (
    <Modal
      visible={showModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowModal(false)}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedFood?.name}</Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Icon name="x" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.quantityContainer}>
                <Text style={styles.label}>Quantidade (g)</Text>
                <TextInput
                  style={styles.quantityInput}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  placeholder="100"
                  placeholderTextColor="#666"
                  autoFocus={true}
                />
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
                <Text style={styles.infoTitle}>Benefits</Text>
                <Text style={styles.infoText}>{selectedFood?.benefits}</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Diet Information</Text>
                <Text style={styles.infoText}>{selectedFood?.dietInfo}</Text>
              </View>

              <TouchableOpacity style={styles.addButton} onPress={handleAddSelectedFood}>
                <Text style={styles.addButtonText}>Add to {mealType}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Food</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search foods..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.foodItem}
            onPress={() => handleFoodSelect(item)}
          >
            <View>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodMacros}>
                {item.calories} cal | P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
              </Text>
            </View>
            <Icon name="plus" size={24} color="#35AAFF" />
          </TouchableOpacity>
        )}
      />

      {selectedFood && <FoodDetailModal />}
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
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  foodName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  foodMacros: {
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
  quantityContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  quantityInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
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
  addButton: {
    backgroundColor: '#35AAFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FoodSearchScreen;

