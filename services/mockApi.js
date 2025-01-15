import AsyncStorage from '@react-native-async-storage/async-storage';

const FOOD_ENTRIES_KEY = 'food_entries';
const FOOD_DATABASE_KEY = 'food_database';

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
};

