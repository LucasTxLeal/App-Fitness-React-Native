import AsyncStorage from '@react-native-async-storage/async-storage';

const FOOD_ENTRIES_KEY = 'food_entries';
const FOOD_DATABASE_KEY = 'food_database';

// Initialize mock food database
const initializeFoodDatabase = async () => {
  const existingDatabase = await AsyncStorage.getItem(FOOD_DATABASE_KEY);
  if (!existingDatabase) {
    const initialFoods = [
      { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
      { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
      { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      { name: 'Salmon', calories: 206, protein: 22, carbs: 0, fat: 13 },
      { name: 'Brown Rice', calories: 216, protein: 5, carbs: 45, fat: 1.6 },
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
      return parsedEntries[date] || [];
    } catch (error) {
      console.error('Error getting food entries:', error);
      return [];
    }
  },

  // Add a new food entry
  addFoodEntry: async (entry) => {
    try {
      const entries = await AsyncStorage.getItem(FOOD_ENTRIES_KEY);
      const parsedEntries = entries ? JSON.parse(entries) : {};
      
      if (!parsedEntries[entry.date]) {
        parsedEntries[entry.date] = [];
      }
      parsedEntries[entry.date].push(entry);
      
      await AsyncStorage.setItem(FOOD_ENTRIES_KEY, JSON.stringify(parsedEntries));
      return true;
    } catch (error) {
      console.error('Error adding food entry:', error);
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
};

