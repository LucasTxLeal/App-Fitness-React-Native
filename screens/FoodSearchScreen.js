import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { obterAlimentosPorTipoRefeicao, registrarRefeicao } from '../services/api';

const FoodSearchScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState('100');
  const [showModal, setShowModal] = useState(false);

  const { mealType, date } = route.params;

  useEffect(() => {
    console.log('FoodSearchScreen montada com mealType:', mealType);
    loadFoods();
  }, [mealType]);

  const loadFoods = async () => {
    try {
      setLoading(true);
      console.log('Carregando alimentos para tipo:', mealType);
      const response = await obterAlimentosPorTipoRefeicao(mealType);
      console.log('Resposta da API:', response);
      
      if (response && response.alimentos) {
        console.log('Alimentos encontrados:', response.alimentos.length);
        setFoods(response.alimentos);
      } else {
        console.warn('Resposta inválida da API:', response);
        setFoods([]);
      }
    } catch (error) {
      console.error('Erro ao carregar alimentos:', error);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setShowModal(true);
  };

  const handleAddFood = async () => {
    if (!selectedFood || !quantity) return;

    try {
      await registrarRefeicao({
        tipo_id: mealType,
        alimento_id: selectedFood.id,
        quantidade_gramas: parseFloat(quantity),
        data_registro: date,
      });
      setShowModal(false);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao adicionar alimento:', error);
    }
  };

  const filteredFoods = foods.filter(food =>
    food.nome_alimento.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFoodItem = ({ item }) => {
    const calories = item.calorias;
    const protein = item.proteinas;
    const carbs = item.carboidratos;
    const fat = item.gorduras;

    return (
      <TouchableOpacity
        style={styles.foodItem}
        onPress={() => handleFoodSelect(item)}
      >
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{item.nome_alimento}</Text>
          <View style={styles.macroRow}>
            <Text style={styles.calories}>{calories} cal</Text>
            <Text style={styles.macros}>
              P: {protein}g | C: {carbs}g | G: {fat}g
            </Text>
          </View>
        </View>
        <Icon name="plus" size={24} color="#35AAFF" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Adicionar Alimento</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar alimentos..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#35AAFF" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredFoods}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.foodList}
        />
      )}

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedFood?.nome_alimento}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon name="x" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalInfo}>
              <Text style={styles.modalCalories}>
                {selectedFood?.calorias} calorias
              </Text>
              <Text style={styles.modalMacros}>
                Proteínas: {selectedFood?.proteinas}g
              </Text>
              <Text style={styles.modalMacros}>
                Carboidratos: {selectedFood?.carboidratos}g
              </Text>
              <Text style={styles.modalMacros}>
                Gorduras: {selectedFood?.gorduras}g
              </Text>
            </View>

            <Text style={styles.quantityLabel}>Quantidade (g)</Text>
            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="Digite a quantidade em gramas"
              placeholderTextColor="#666"
            />

            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddFood}
            >
              <Text style={styles.addButtonText}>Adicionar ao Diário</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
    backgroundColor: '#333',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodList: {
    padding: 16,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  foodInfo: {
    flex: 1,
    marginRight: 16,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calories: {
    fontSize: 14,
    color: '#35AAFF',
    marginRight: 8,
  },
  macros: {
    fontSize: 14,
    color: '#999',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalInfo: {
    backgroundColor: '#262626',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  modalCalories: {
    fontSize: 18,
    color: '#35AAFF',
    marginBottom: 8,
  },
  modalMacros: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  quantityInput: {
    backgroundColor: '#262626',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#35AAFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FoodSearchScreen;

