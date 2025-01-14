import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';

const ExerciseDetailScreen = ({ route, navigation }) => {
  const { exercise } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{exercise.name}</Text>
      </View>
      <ScrollView style={styles.content}>
        <Image source={{ uri: exercise.image }} style={styles.exerciseImage} />
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{exercise.description}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Difficulty:</Text>
            <Text style={styles.detailValue}>{exercise.difficulty}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Equipment:</Text>
            <Text style={styles.detailValue}>{exercise.equipment}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Muscles:</Text>
            <Text style={styles.detailValue}>{exercise.muscles.join(', ')}</Text>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  infoSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  sectionTitle: {
    color: '#35AAFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#999',
    fontSize: 16,
    width: 100,
  },
  detailValue: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
});

export default ExerciseDetailScreen;

