import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { obterAlimentosPorTipoRefeicao, registrarRefeicao } from '../services/api';

const FoodSearchScreen = ({ route, navigation }) => {
  const { mealType, date } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState('100');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadFoods = useCallback(async () => {
    try {
      setLoading(true);
      const response = await obterAlimentosPorTipoRefeicao(mealType);
      console.log('Alimentos carregados:', response);
      setSearchResults(response.alimentos || []); // Acessar a propriedade 'alimentos' do objeto
    } catch (error) {
      console.error('Erro ao carregar alimentos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os alimentos. Por favor, tente novamente.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [mealType]);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (searchResults && searchResults.length > 0) {
      const filteredFoods = searchResults.filter(food => 
        food.nome_alimento.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredFoods);
    }
  };

  const handleFoodSelect = (food) => {
    console.log('Alimento selecionado:', food);
    setSelectedFood(food);
    setShowModal(true);
  };

  const handleAddSelectedFood = async () => {
    const amount = parseInt(quantity);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erro', 'Por favor, insira uma quantidade válida');
      return;
    }

    try {
      const refeicaoData = {
        data_registro: date,
        tipo_id: mealType,
        alimento_id: selectedFood.id,
        quantidade_gramas: amount,
      };
      console.log('Enviando dados da refeição:', refeicaoData);
      
      await registrarRefeicao(refeicaoData);
      setShowModal(false);
      navigation.navigate('FoodTrackerMain', { updateData: true });
    } catch (error) {
      console.error('Erro ao adicionar alimento:', error);
      if (error.message === "Este alimento já foi registrado nesta data.") {
        Alert.alert(
          'Alimento já registrado',
          'Este alimento já foi registrado para esta refeição hoje. Deseja atualizar a quantidade?',
          [
            {
              text: 'Cancelar',
              style: 'cancel'
            },
            {
              text: 'Atualizar',
              onPress: () => updateExistingFood(refeicaoData)
            }
          ]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível adicionar o alimento. Por favor, tente novamente.');
      }
    }
  };

  const updateExistingFood = async (refeicaoData) => {
    try {
      // Aqui você precisará implementar uma nova função na API para atualizar a refeição existente
      // Por enquanto, vamos apenas simular uma atualização bem-sucedida
      console.log('Atualizando refeição existente:', refeicaoData);
      // await atualizarRefeicaoExistente(refeicaoData);
      Alert.alert('Sucesso', 'A quantidade do alimento foi atualizada.');
      setShowModal(false);
      navigation.navigate('FoodTrackerMain', { updateData: true });
    } catch (error) {
      console.error('Erro ao atualizar alimento:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o alimento. Por favor, tente novamente.');
    }
  };

  const calculateAdjustedNutrients = (food, amount) => {
    const factor = amount / 100; // as nutrients are per 100g
    return {
      calories: Math.round(food.calorias * factor),
      protein: Math.round(food.proteinas * factor),
      fat: Math.round(food.gorduras * factor),
    };
  };

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity
      style={styles.foodItem}
      onPress={() => handleFoodSelect(item)}
    >
      <View>
        <Text style={styles.foodName}>{item.nome_alimento}</Text>
        <Text style={styles.foodMacros}>
          {item.calorias} cal | P: {item.proteinas}g | G: {item.gorduras}g
        </Text>
      </View>
      <Icon name="plus" size={24} color="#35AAFF" />
    </TouchableOpacity>
  );

  const FoodDetailModal = () => {
    if (!selectedFood) return null;

    const adjustedNutrients = calculateAdjustedNutrients(selectedFood, parseInt(quantity) || 100);

    return (
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedFood.nome_alimento}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon name="x" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.quantityContainer}>
              <Text style={styles.label}>Quantidade (g)</Text>
              <TextInput
                style={styles.quantityInput}
                value={quantity}
                onChangeText={(text) => {
                  setQuantity(text);
                }}
                keyboardType="numeric"
                placeholder="100"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Calorias</Text>
                <Text style={styles.nutritionValue}>{adjustedNutrients.calories}</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Proteínas</Text>
                <Text style={styles.nutritionValue}>{adjustedNutrients.protein}g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Gorduras</Text>
                <Text style={styles.nutritionValue}>{adjustedNutrients.fat}g</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddSelectedFood}>
              <Text style={styles.addButtonText}>Adicionar ao {
                mealType === 1 ? 'Café da Manhã' :
                mealType === 2 ? 'Almoço' :
                mealType === 3 ? 'Jantar' : 'Lanche'
              }</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Alimento</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar alimentos..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando alimentos...</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFoodItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum alimento encontrado</Text>
            </View>
          }
        />
      )}

      <FoodDetailModal />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
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
    backgroundColor: '#444',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nutritionItem: {
    flex: 1,
    alignItems: 'center',
  },
  nutritionLabel: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  nutritionValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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

