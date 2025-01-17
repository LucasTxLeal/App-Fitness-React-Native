import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  criarRegistroProgresso,
  obterProgresso,
  deletarProgresso,
  atualizarProgresso,
  criarLogDesempenho,
  obterLogsDesempenho,
  deletarLogDesempenho,
  atualizarLogDesempenho,
} from '../services/api';

const ProfileScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [progressoLogs, setProgressoLogs] = useState([]);
  const [performanceLogs, setPerformanceLogs] = useState([]);
  const [novoProgresso, setNovoProgresso] = useState({
    data: new Date().toISOString().split('T')[0],
    pesoAtual: '',
    imc: '',
    performance: '',
    treinosConcluidos: '',
  });
  const [novoDesempenho, setNovoDesempenho] = useState({
    data: new Date().toISOString().split('T')[0],
    pesoLevantado: '',
    repeticoes: '',
    observacoes: '',
  });

  useEffect(() => {
    carregarDados();
    carregarNomeUsuario();
  }, []);

  const carregarNomeUsuario = async () => {
    try {
      const nome = await AsyncStorage.getItem('userName');
      if (nome) {
        setUserName(nome);
      }
    } catch (error) {
      console.error('Erro ao carregar o nome do usuário:', error);
    }
  };

  const carregarDados = async () => {
    try {
      const progressoData = await obterProgresso();
      const desempenhoData = await obterLogsDesempenho();
      
      console.log('Progresso Data:', JSON.stringify(progressoData));
      console.log('Desempenho Data:', JSON.stringify(desempenhoData));

      if (Array.isArray(progressoData)) {
        setProgressoLogs(progressoData);
      } else {
        console.error('Formato inválido para dados de progresso:', progressoData);
        setProgressoLogs([]);
      }

      if (Array.isArray(desempenhoData)) {
        setPerformanceLogs(desempenhoData);
      } else {
        console.error('Formato inválido para dados de desempenho:', desempenhoData);
        setPerformanceLogs([]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados. Por favor, tente novamente.');
      setProgressoLogs([]);
      setPerformanceLogs([]);
    }
  };

  const adicionarProgresso = async () => {
    try {
      await criarRegistroProgresso({
        ...novoProgresso,
        pesoAtual: parseFloat(novoProgresso.pesoAtual),
        imc: parseFloat(novoProgresso.imc),
        treinosConcluidos: parseInt(novoProgresso.treinosConcluidos),
      });
      setNovoProgresso({
        data: new Date().toISOString().split('T')[0],
        pesoAtual: '',
        imc: '',
        performance: '',
        treinosConcluidos: '',
      });
      carregarDados();
    } catch (error) {
      console.error('Erro ao adicionar progresso:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o progresso. Por favor, tente novamente.');
    }
  };

  const adicionarDesempenho = async () => {
    try {
      await criarLogDesempenho({
        ...novoDesempenho,
        pesoLevantado: parseFloat(novoDesempenho.pesoLevantado),
        repeticoes: parseInt(novoDesempenho.repeticoes),
      });
      setNovoDesempenho({
        data: new Date().toISOString().split('T')[0],
        pesoLevantado: '',
        repeticoes: '',
        observacoes: '',
      });
      carregarDados();
    } catch (error) {
      console.error('Erro ao adicionar desempenho:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o log de desempenho. Por favor, tente novamente.');
    }
  };

  const excluirProgresso = async (id) => {
    if (typeof id === 'undefined' || id === null) {
      console.error('ID de progresso inválido:', id);
      Alert.alert('Erro', 'Não foi possível identificar o registro para exclusão.');
      return;
    }
    try {
      await deletarProgresso(id);
      carregarDados();
    } catch (error) {
      console.error('Erro ao excluir progresso:', error);
      Alert.alert('Erro', 'Não foi possível excluir o progresso. Por favor, tente novamente.');
    }
  };

  const excluirDesempenho = async (id) => {
    if (typeof id === 'undefined' || id === null) {
      console.error('ID de desempenho inválido:', id);
      Alert.alert('Erro', 'Não foi possível identificar o log para exclusão.');
      return;
    }
    try {
      await deletarLogDesempenho(id);
      carregarDados();
    } catch (error) {
      console.error('Erro ao excluir desempenho:', error);
      Alert.alert('Erro', 'Não foi possível excluir o log de desempenho. Por favor, tente novamente.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Icon name="user" size={64} color="#35AAFF" />
          <Text style={styles.username}>{userName || 'Usuário'}</Text>
        </View>

        <TouchableOpacity
          style={styles.progressButton}
          onPress={() => navigation.navigate('Progress')}
        >
          <Text style={styles.progressButtonText}>Ver Progresso Detalhado</Text>
          <Icon name="chevron-right" size={24} color="#35AAFF" />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registrar Progresso</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Peso Atual (kg)"
              placeholderTextColor="#666"
              value={novoProgresso.pesoAtual}
              onChangeText={(text) => setNovoProgresso({ ...novoProgresso, pesoAtual: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="IMC"
              placeholderTextColor="#666"
              value={novoProgresso.imc}
              onChangeText={(text) => setNovoProgresso({ ...novoProgresso, imc: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Performance"
              placeholderTextColor="#666"
              value={novoProgresso.performance}
              onChangeText={(text) => setNovoProgresso({ ...novoProgresso, performance: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Treinos Concluídos"
              placeholderTextColor="#666"
              value={novoProgresso.treinosConcluidos}
              onChangeText={(text) => setNovoProgresso({ ...novoProgresso, treinosConcluidos: text })}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.addButton} onPress={adicionarProgresso}>
              <Text style={styles.addButtonText}>Adicionar Progresso</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registrar Desempenho</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Peso Levantado (kg)"
              placeholderTextColor="#666"
              value={novoDesempenho.pesoLevantado}
              onChangeText={(text) => setNovoDesempenho({ ...novoDesempenho, pesoLevantado: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Repetições"
              placeholderTextColor="#666"
              value={novoDesempenho.repeticoes}
              onChangeText={(text) => setNovoDesempenho({ ...novoDesempenho, repeticoes: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Observações"
              placeholderTextColor="#666"
              value={novoDesempenho.observacoes}
              onChangeText={(text) => setNovoDesempenho({ ...novoDesempenho, observacoes: text })}
            />
            <TouchableOpacity style={styles.addButton} onPress={adicionarDesempenho}>
              <Text style={styles.addButtonText}>Adicionar Desempenho</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico de Progresso</Text>
          {progressoLogs.map((log, index) => (
            <View key={log.id || index} style={styles.logItem}>
              <Text style={styles.logDate}>{log.Data}</Text>
              <Text style={styles.logText}>Peso: {log.PesoAtual} kg</Text>
              <Text style={styles.logText}>IMC: {log.IMC}</Text>
              <Text style={styles.logText}>Performance: {log.Performance}</Text>
              <Text style={styles.logText}>Treinos Concluídos: {log.TreinosConcluidos}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => excluirProgresso(log.id)}
              >
                <Icon name="trash-2" size={20} color="#FF375B" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico de Desempenho</Text>
          {performanceLogs.map((log, index) => (
            <View key={log.id || index} style={styles.logItem}>
              <Text style={styles.logDate}>{log.Data}</Text>
              <Text style={styles.logText}>Peso Levantado: {log.PesoLevantado} kg</Text>
              <Text style={styles.logText}>Repetições: {log.Repeticoes}</Text>
              <Text style={styles.logText}>Observações: {log.Observacoes}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => excluirDesempenho(log.id)}
              >
                <Icon name="trash-2" size={20} color="#FF375B" />
              </TouchableOpacity>
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
  inputContainer: {
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
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default ProfileScreen;

