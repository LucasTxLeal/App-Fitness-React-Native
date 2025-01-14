import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';

const ProgressScreen = ({ navigation }) => {
  const [progressLogs, setProgressLogs] = useState([]);
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0],
    currentWeight: '',
    bmi: '',
    performance: '',
    // Removido o campo completedWorkouts
  });

  const addProgressLog = () => {
    setProgressLogs([...progressLogs, newLog]);
    setNewLog({
      date: new Date().toISOString().split('T')[0],
      currentWeight: '',
      bmi: '',
      performance: '',
      // Resetando o campo completedWorkouts para vazio
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Progress</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.logInput}>
          <TextInput
            style={styles.input}
            placeholder="Current Weight (kg)"
            placeholderTextColor="#666"
            value={newLog.currentWeight}
            onChangeText={(text) => setNewLog({ ...newLog, currentWeight: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="BMI"
            placeholderTextColor="#666"
            value={newLog.bmi}
            onChangeText={(text) => setNewLog({ ...newLog, bmi: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Performance"
            placeholderTextColor="#666"
            value={newLog.performance}
            onChangeText={(text) => setNewLog({ ...newLog, performance: text })}
          />
          {/* Removido o campo de Completed Workouts */}
          <TouchableOpacity style={styles.addButton} onPress={addProgressLog}>
            <Text style={styles.addButtonText}>Add Progress Log</Text>
          </TouchableOpacity>
        </View>
        {progressLogs.map((log, index) => (
          <View key={index} style={styles.logItem}>
            <Text style={styles.logDate}>{log.date}</Text>
            <Text style={styles.logText}>Weight: {log.currentWeight} kg</Text>
            <Text style={styles.logText}>BMI: {log.bmi}</Text>
            <Text style={styles.logText}>Performance: {log.performance}</Text>
            {/* Removido a exibição de Completed Workouts */}
          </View>
        ))}
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
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  content: {
    padding: 20,
  },
  logInput: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#444',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#35AAFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logItem: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  logDate: {
    color: '#35AAFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  logText: {
    color: '#fff',
    marginBottom: 3,
  },
});

export default ProgressScreen;
