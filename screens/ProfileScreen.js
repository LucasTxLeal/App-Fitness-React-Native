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

const ProfileScreen = ({ navigation }) => {
  const [performanceLogs, setPerformanceLogs] = useState([]);
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0],
    liftedWeight: '',
    repetitions: '',
    observations: '',
  });

  const addPerformanceLog = () => {
    setPerformanceLogs([...performanceLogs, newLog]);
    setNewLog({
      date: new Date().toISOString().split('T')[0],
      liftedWeight: '',
      repetitions: '',
      observations: '',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Icon name="user" size={64} color="#35AAFF" />
          <Text style={styles.username}>John Doe</Text>
        </View>

        <TouchableOpacity
          style={styles.progressButton}
          onPress={() => navigation.navigate('Progress')}
        >
          <Text style={styles.progressButtonText}>View Progress</Text>
          <Icon name="chevron-right" size={24} color="#35AAFF" />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Logs</Text>
          <View style={styles.logInput}>
            <TextInput
              style={styles.input}
              placeholder="Lifted Weight (kg)"
              placeholderTextColor="#666"
              value={newLog.liftedWeight}
              onChangeText={(text) => setNewLog({ ...newLog, liftedWeight: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Repetitions"
              placeholderTextColor="#666"
              value={newLog.repetitions}
              onChangeText={(text) => setNewLog({ ...newLog, repetitions: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Observations"
              placeholderTextColor="#666"
              value={newLog.observations}
              onChangeText={(text) => setNewLog({ ...newLog, observations: text })}
            />
            <TouchableOpacity style={styles.addButton} onPress={addPerformanceLog}>
              <Text style={styles.addButtonText}>Add Log</Text>
            </TouchableOpacity>
          </View>
          {performanceLogs.map((log, index) => (
            <View key={index} style={styles.logItem}>
              <Text style={styles.logDate}>{log.date}</Text>
              <Text style={styles.logText}>Weight: {log.liftedWeight} kg</Text>
              <Text style={styles.logText}>Reps: {log.repetitions}</Text>
              <Text style={styles.logText}>Notes: {log.observations}</Text>
            </View>
          ))}
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  progressButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  progressButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logInput: {
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
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

export default ProfileScreen;

