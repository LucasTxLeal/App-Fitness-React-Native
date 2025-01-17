import AsyncStorage from '@react-native-async-storage/async-storage';

const FOOD_ENTRIES_KEY = 'food_entries';
const FOOD_DATABASE_KEY = 'food_database';
const CALORIE_GOAL_KEY = 'calorie_goal';

// Initialize mock food database
const initializeFoodDatabase = async () => {
  const existingDatabase = await AsyncStorage.getItem(FOOD_DATABASE_KEY);
  if (!existingDatabase) {
    const initialFoods = [
      {
        name: 'Arroz Branco (Cozido)',
        calories: 129,
        protein: 2.5,
        carbs: 28.18,
        fat: 0.23,
        benefits: 'Good source of energy, easily digestible carbohydrates',
        dietInfo: 'Suitable for most diets, moderate glycemic index',
        portionSize: 100, // in grams
        energy: 538, // in KJ
        category: 'Grains',
      },
      {
        name: 'Frango Grelhado',
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        benefits: 'Excellent source of lean protein, rich in B vitamins',
        dietInfo: 'Ideal for weight loss and muscle building diets',
        portionSize: 100,
        energy: 690,
        category: 'Proteins',
      },
      {
        name: 'Brócolis Cozido',
        calories: 55,
        protein: 3.7,
        carbs: 11.2,
        fat: 0.6,
        benefits: 'High in fiber, vitamin C, and antioxidants',
        dietInfo: 'Perfect for low-calorie and vegetarian diets',
        portionSize: 100,
        energy: 230,
        category: 'Vegetables',
      },
    ];
    await AsyncStorage.setItem(FOOD_DATABASE_KEY, JSON.stringify(initialFoods));
  }
};

// Initialize the food database
initializeFoodDatabase();

// Mock data for personal trainer requests
const MOCK_REQUESTS = [
  {
    id: 1,
    usuario: {
      nome: 'João Silva',
    },
    data_solicitacao: '2024-01-18',
    objetivo: 'Ganho de massa muscular e definição',
    disponibilidade: {
      horarios: ['Manhã (6h-12h)', 'Noite (18h-22h)'],
      dias: ['Segunda', 'Quarta', 'Sexta']
    },
    mensagem: 'Gostaria de começar o quanto antes!'
  },
  {
    id: 2,
    usuario: {
      nome: 'Maria Santos',
    },
    data_solicitacao: '2024-01-17',
    objetivo: 'Perda de peso e condicionamento',
    disponibilidade: {
      horarios: ['Tarde (12h-18h)'],
      dias: ['Terça', 'Quinta', 'Sábado']
    },
    mensagem: 'Preciso de ajuda para atingir meus objetivos de forma saudável.'
  }
];

export const mockApi = {
  // Get food entries for a specific date
  getFoodEntries: async (date) => {
    try {
      const entries = await AsyncStorage.getItem(FOOD_ENTRIES_KEY);
      const parsedEntries = entries ? JSON.parse(entries) : {};
      return parsedEntries[date] || {};
    } catch (error) {
      console.error('Error getting food entries:', error);
      return {};
    }
  },

  // Add a new food entry
  addFoodEntry: async (date, mealType, entry) => {
    try {
      const entries = await AsyncStorage.getItem(FOOD_ENTRIES_KEY);
      const parsedEntries = entries ? JSON.parse(entries) : {};
      
      if (!parsedEntries[date]) {
        parsedEntries[date] = {};
      }
      if (!parsedEntries[date][mealType]) {
        parsedEntries[date][mealType] = [];
      }
      
      parsedEntries[date][mealType].push(entry);
      await AsyncStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(parsedEntries));
      return true;
    } catch (error) {
      console.error('Error adding food entry:', error);
      return false;
    }
  },

  // Remove a food entry
  removeFoodEntry: async (date, mealType, entryIndex) => {
    try {
      const entries = await AsyncStorage.getItem(FOOD_ENTRIES_KEY);
      const parsedEntries = entries ? JSON.parse(entries) : {};
      
      if (parsedEntries[date]?.[mealType]) {
        parsedEntries[date][mealType].splice(entryIndex, 1);
        await AsyncStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(parsedEntries));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing food entry:', error);
      return false;
    }
  },

  // Search for foods in the database
  searchFoods: async (query) => {
    try {
      const foodDatabase = await AsyncStorage.getItem(FOOD_DATABASE_KEY);
      const parsedDatabase = foodDatabase ? JSON.parse(foodDatabase) : [];
      
      return parsedDatabase.filter(food => 
        food.name.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching foods:', error);
      return [];
    }
  },

  // Get food details
  getFoodDetails: async (foodName) => {
    try {
      const foodDatabase = await AsyncStorage.getItem(FOOD_DATABASE_KEY);
      const parsedDatabase = foodDatabase ? JSON.parse(foodDatabase) : [];
      return parsedDatabase.find(food => food.name === foodName);
    } catch (error) {
      console.error('Error getting food details:', error);
      return null;
    }
  },

  clearAllData: async () => {
    try {
      await AsyncStorage.clear();
      console.log('All data cleared');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  },

  getCalorieGoal: async () => {
    try {
      const calorieGoal = await AsyncStorage.getItem(CALORIE_GOAL_KEY);
      return calorieGoal ? parseInt(calorieGoal) : 2500; // Default to 2500 if not set
    } catch (error) {
      console.error('Error getting calorie goal:', error);
      return 2500; // Default value
    }
  },

  setCalorieGoal: async (goal) => {
    try {
      await AsyncStorage.setItem(CALORIE_GOAL_KEY, goal.toString());
      return true;
    } catch (error) {
      console.error('Error setting calorie goal:', error);
      return false;
    }
  },

  // New functions for personal trainer requests
  obterSolicitacoesPersonal: async () => {
    // Simula um delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    return MOCK_REQUESTS;
  },

  aceitarSolicitacao: async (solicitacaoId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  recusarSolicitacao: async (solicitacaoId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  enviarSolicitacaoPersonal: async (dadosSolicitacao) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
};

export const {
  getFoodEntries,
  addFoodEntry,
  removeFoodEntry,
  searchFoods,
  getFoodDetails,
  clearAllData,
  getCalorieGoal,
  setCalorieGoal,
  obterSolicitacoesPersonal,
  aceitarSolicitacao,
  recusarSolicitacao,
  enviarSolicitacaoPersonal,
} = mockApi;

export default mockApi;

