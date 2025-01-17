import './gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Feather as Icon } from '@expo/vector-icons';
import { View, TouchableOpacity, Text, Platform, StatusBar } from 'react-native';
import { AuthProvider } from './contexts/AuthContext';

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
import ProgressScreen from './screens/ProgressScreen';
import RequestTrainerScreen from './screens/RequestTrainerScreen';
import ManageRequestsScreen from './screens/ManageRequestsScreen';

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
        name="Painel"
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
      <Tab.Screen
        name="Progresso"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="trending-up" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const ExerciseStack = () => {
  const styles = {
    header: {
      backgroundColor: '#191919',
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20,
      height: Platform.OS === 'android' ? StatusBar.currentHeight + 56 : 64,
    },
    headerTitle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 16,
    },
  };
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        header: ({ navigation, route, options }) => {
          const isDetail = route.name === 'Detalhes do exercício';
          return (
            <View style={[styles.header, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
              <TouchableOpacity 
                onPress={() => isDetail ? navigation.goBack() : navigation.openDrawer()}
              >
                <Icon 
                  name={isDetail ? "arrow-left" : "menu"} 
                  size={24} 
                  color="#fff" 
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {isDetail ? route.params?.exercise?.name : "Exercícios"}
              </Text>
            </View>
          );
        }
      }}
    >
      <Stack.Screen name="Lista de exercícios" component={ExerciseScreen} />
      <Stack.Screen 
        name="Detalhes dos exercícios" 
        component={ExerciseDetailScreen}
        options={{
          headerShown: true,
        }}
      />
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
      <Stack.Screen name="FoodTrackerMain" component={FoodTrackerScreen} />
      <Stack.Screen name="FoodSearchScreen" component={FoodSearchScreen} />
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
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
        name="Exercício"
        component={ExerciseStack}
        options={{
          title: 'Exercícios',
          headerShown: false,
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
        name="FoodTrackerStack"
        component={FoodStack}
        options={{
          title: 'Rastreador de alimentos',
          drawerIcon: ({ color, size }) => (
            <Icon name="clipboard" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Training"
        component={TrainingStack}
        options={{
          title: 'Plano de treino',
          drawerIcon: ({ color, size }) => (
            <Icon name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="RequestTrainer"
        component={RequestTrainerScreen}
        options={{
          title: 'Solicitar Personal',
          drawerIcon: ({ color, size }) => (
            <Icon name="user-plus" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="ManageRequests"
        component={ManageRequestsScreen}
        options={{
          title: 'Gerenciar Solicitações',
          drawerIcon: ({ color, size }) => (
            <Icon name="users" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
};

export default App;

