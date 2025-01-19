import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Carregar o ID do usuário do AsyncStorage quando o app iniciar
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Erro ao carregar ID do usuário:', error);
      }
    };

    loadUserId();
  }, []);

  const updateUserId = async (newUserId) => {
    try {
      await AsyncStorage.setItem('userId', newUserId);
      setUserId(newUserId);
    } catch (error) {
      console.error('Erro ao atualizar ID do usuário:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ userId, updateUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

