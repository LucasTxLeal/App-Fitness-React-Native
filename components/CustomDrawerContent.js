import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={styles.drawerHeader}>
        <Icon name="activity" size={50} color="#35AAFF" />
        <Text style={styles.drawerHeaderText}>AppFitness</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Ajuda"
        icon={({ color, size }) => (
          <Icon name="help-circle" color={color} size={size} />
        )}
        onPress={() => {
          // Add navigation to Help screen or open a help modal
        }}
      />
      <DrawerItem
        label="Sair"
        icon={({ color, size }) => (
          <Icon name="log-out" color={color} size={size} />
        )}
        onPress={() => {
          // Handle logout
          props.navigation.navigate('Login');
        }}
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f4',
    alignItems: 'center',
  },
  drawerHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#35AAFF',
  },
});

export default CustomDrawerContent;

