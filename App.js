import './gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Feather as Icon } from '@expo/vector-icons';

import LoginScreen from './screens/LoginScreen';
import RegisterUserScreen from './screens/RegisterUserScreen';
import RegisterTrainerScreen from './screens/RegisterTrainerScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import ExerciseScreen from './screens/ExerciseScreen';
import ExerciseDetailScreen from './screens/ExerciseDetailScreen';
import ChatScreen from './screens/ChatScreen';
import CustomDrawerContent from './components/CustomDrawerContent';
import FoodTrackerScreen from './screens/FoodTrackerScreen';
import FoodSearchScreen from './screens/FoodSearchScreen';
import TrainingScreen from './screens/TrainingScreen';
import CreateWorkoutPlanScreen from './screens/CreateWorkoutPlanScreen';
import WorkoutPlanDetailScreen from './screens/WorkoutPlanDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#191919',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#35AAFF',
        tabBarInactiveTintColor: '#666',
        headerStyle: {
          backgroundColor: '#191919',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const ExerciseStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ExerciseList" component={ExerciseScreen} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
    </Stack.Navigator>
  );
};

const FoodStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="FoodTracker" component={FoodTrackerScreen} />
      <Stack.Screen name="FoodSearch" component={FoodSearchScreen} />
    </Stack.Navigator>
  );
};

const TrainingStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TrainingMain" component={TrainingScreen} />
      <Stack.Screen name="CreateWorkoutPlan" component={CreateWorkoutPlanScreen} />
      <Stack.Screen name="WorkoutPlanDetail" component={WorkoutPlanDetailScreen} />
    </Stack.Navigator>
  );
};

const MainDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#191919',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerStyle: {
          backgroundColor: '#fff',
          width: 240,
        },
        drawerActiveTintColor: '#35AAFF',
        drawerInactiveTintColor: '#333',
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Exercicios"
        component={ExerciseStack}
        options={{
          title: 'Exercícios',
          drawerIcon: ({ color, size }) => (
            <Icon name="activity" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Chat com Personal',
          drawerIcon: ({ color, size }) => (
            <Icon name="message-circle" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="FoodTracker"
        component={FoodStack}
        options={{
          title: 'Food Tracker',
          drawerIcon: ({ color, size }) => (
            <Icon name="clipboard" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Training"
        component={TrainingStack}
        options={{
          title: 'Training Plan',
          drawerIcon: ({ color, size }) => (
            <Icon name="calendar" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RegisterUser" component={RegisterUserScreen} />
        <Stack.Screen name="RegisterTrainer" component={RegisterTrainerScreen} />
        <Stack.Screen name="Main" component={MainDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

