import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';

const ExerciseDetailScreen = ({ route, navigation }) => {
  const { exercise } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{exercise.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Músculos Trabalhados</Text>
          <View style={styles.tagContainer}>
            {exercise.muscles.map((muscle, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{muscle}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Equipamento:</Text>
            <Text style={styles.infoValue}>{exercise.equipment}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nível:</Text>
            <Text style={styles.infoValue}>{exercise.difficulty}</Text>
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#35AAFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  tag: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#666',
    fontSize: 16,
    width: 120,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ExerciseDetailScreen;

