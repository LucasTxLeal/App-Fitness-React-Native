import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Redireciona para a tela de login
    navigation.navigate('Login');
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Cabeçalho do drawer */}
      <View style={styles.drawerHeader}>
        <Icon name="activity" size={50} color="#35AAFF" />
      </View>

      {/* Lista de itens padrão do drawer */}
      <DrawerItemList {...props} />

      {/* Botão de Sair */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
  },
  logoutContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  logoutButton: {
    backgroundColor: '#FF5757',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CustomDrawerContent;
