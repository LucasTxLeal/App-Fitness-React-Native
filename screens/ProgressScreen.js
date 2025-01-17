import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {
  obterProgresso,
  obterLogsDesempenho,
  deletarProgresso,
  atualizarProgresso,
  deletarLogDesempenho,
  atualizarLogDesempenho,
} from '../services/api';

const ProgressScreen = ({ navigation }) => {
  const [progressoLogs, setProgressoLogs] = useState([]);
  const [performanceLogs, setPerformanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProgress, setEditingProgress] = useState(null);
  const [editingPerformance, setEditingPerformance] = useState(null);
  const [editForm, setEditForm] = useState({
    pesoAtual: '',
    imc: '',
    performance: '',
    treinosConcluidos: '',
    pesoLevantado: '',
    repeticoes: '',
    observacoes: '',
  });

  const checkAuthAndLoadData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return;
      }
      await carregarDados();
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      handleAuthError();
    }
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      checkAuthAndLoadData();
    }, [checkAuthAndLoadData])
  );

  const carregarDados = async () => {
    setLoading(true);
    setError(null);
    try {
      const [progressoData, desempenhoData] = await Promise.all([
        obterProgresso(),
        obterLogsDesempenho(),
      ]);
      
      console.log('Dados carregados:', {
        progresso: progressoData,
        desempenho: desempenhoData,
      });

      setProgressoLogs(Array.isArray(progressoData) ? progressoData : []);
      setPerformanceLogs(Array.isArray(desempenhoData) ? desempenhoData : []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError(error.message || 'Erro ao carregar dados');
      if (error.response?.status === 403 || error.response?.status === 401) {
        handleAuthError();
        return;
      }
      Alert.alert('Erro', 'Não foi possível carregar os dados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Erro ao limpar token:', error);
    }
  };

  const handleRetry = () => {
    carregarDados();
  };

  const handleEditProgress = (log) => {
    console.log('Editando progresso:', log);
    if (!log || typeof log.id === 'undefined') {
      console.error('Log de progresso inválido:', log);
      return;
    }
    setEditingProgress(log);
    setEditForm({
      pesoAtual: log.PesoAtual ? log.PesoAtual.toString() : '',
      imc: log.IMC ? log.IMC.toString() : '',
      performance: log.Performance || '',
      treinosConcluidos: log.TreinosConcluidos ? log.TreinosConcluidos.toString() : '',
    });
  };

  const handleEditPerformance = (log) => {
    console.log('Editando desempenho:', log);
    if (!log || typeof log.id === 'undefined') {
      console.error('Log de desempenho inválido:', log);
      return;
    }
    setEditingPerformance(log);
    setEditForm({
      pesoLevantado: log.PesoLevantado ? log.PesoLevantado.toString() : '',
      repeticoes: log.Repeticoes ? log.Repeticoes.toString() : '',
      observacoes: log.Observacoes || '',
    });
  };

  const handleUpdateProgress = async () => {
    if (!editingProgress || typeof editingProgress.id === 'undefined') {
      console.error('ID de progresso inválido', editingProgress);
      Alert.alert('Erro', 'Não foi possível atualizar o progresso. ID inválido.');
      return;
    }
    try {
      await atualizarProgresso(editingProgress.id, {
        pesoAtual: parseFloat(editForm.pesoAtual),
        imc: parseFloat(editForm.imc),
        performance: editForm.performance,
        treinosConcluidos: parseInt(editForm.treinosConcluidos),
      });
      setEditingProgress(null);
      carregarDados();
      Alert.alert('Sucesso', 'Progresso atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o progresso.');
    }
  };

  const handleUpdatePerformance = async () => {
    if (!editingPerformance || typeof editingPerformance.id === 'undefined') {
      console.error('ID de desempenho inválido', editingPerformance);
      Alert.alert('Erro', 'Não foi possível atualizar o log de desempenho. ID inválido.');
      return;
    }
    try {
      await atualizarLogDesempenho(editingPerformance.id, {
        pesoLevantado: parseFloat(editForm.pesoLevantado),
        repeticoes: parseInt(editForm.repeticoes),
        observacoes: editForm.observacoes,
      });
      setEditingPerformance(null);
      carregarDados();
      Alert.alert('Sucesso', 'Log de desempenho atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar log de desempenho:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o log de desempenho.');
    }
  };

  const handleDeleteProgress = async (id) => {
    if (typeof id === 'undefined' || id === null) {
      console.error('ID de progresso inválido:', id);
      Alert.alert('Erro', 'Não foi possível identificar o registro para exclusão.');
      return;
    }
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este registro de progresso?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarProgresso(id);
              carregarDados();
              Alert.alert('Sucesso', 'Registro excluído com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir progresso:', error);
              Alert.alert('Erro', 'Não foi possível excluir o registro.');
            }
          },
        },
      ]
    );
  };

  const handleDeletePerformance = async (id) => {
    if (typeof id === 'undefined' || id === null) {
      console.error('ID de desempenho inválido:', id);
      Alert.alert('Erro', 'Não foi possível identificar o log para exclusão.');
      return;
    }
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este log de desempenho?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletarLogDesempenho(id);
              carregarDados();
              Alert.alert('Sucesso', 'Log excluído com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir log de desempenho:', error);
              Alert.alert('Erro', 'Não foi possível excluir o log.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#35AAFF" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar dados: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Progresso Detalhado</Text>
        <TouchableOpacity onPress={handleRetry} style={styles.refreshButton}>
          <Icon name="refresh-cw" size={20} color="#35AAFF" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico de Progresso</Text>
          {progressoLogs && progressoLogs.length > 0 ? (
            progressoLogs.map((log) => (
              <View key={log.id || `progress-${Math.random()}`} style={styles.logItem}>
                <View style={styles.logHeader}>
                  <Text style={styles.logDate}>{log.Data}</Text>
                  <View style={styles.logActions}>
                    <TouchableOpacity 
                      onPress={() => handleEditProgress(log)}
                      style={styles.actionButton}
                    >
                      <Icon name="edit-2" size={20} color="#35AAFF" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDeleteProgress(log.id)}
                      style={styles.actionButton}
                    >
                      <Icon name="trash-2" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.logText}>Peso: {log.PesoAtual || 'N/A'} kg</Text>
                <Text style={styles.logText}>IMC: {log.IMC || 'N/A'}</Text>
                <Text style={styles.logText}>Performance: {log.Performance || 'N/A'}</Text>
                <Text style={styles.logText}>Treinos: {log.TreinosConcluidos || 'N/A'}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhum registro de progresso encontrado</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico de Desempenho</Text>
          {performanceLogs && performanceLogs.length > 0 ? (
            performanceLogs.map((log) => (
              <View key={log.id || `performance-${Math.random()}`} style={styles.logItem}>
                <View style={styles.logHeader}>
                  <Text style={styles.logDate}>{log.Data}</Text>
                  <View style={styles.logActions}>
                    <TouchableOpacity 
                      onPress={() => handleEditPerformance(log)}
                      style={styles.actionButton}
                    >
                      <Icon name="edit-2" size={20} color="#35AAFF" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDeletePerformance(log.id)}
                      style={styles.actionButton}
                    >
                      <Icon name="trash-2" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.logText}>Peso Levantado: {log.PesoLevantado || 'N/A'} kg</Text>
                <Text style={styles.logText}>Repetições: {log.Repeticoes || 'N/A'}</Text>
                <Text style={styles.logText}>Observações: {log.Observacoes || 'N/A'}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhum registro de desempenho encontrado</Text>
          )}
        </View>
      </ScrollView>

      {/* Modal de Edição de Progresso */}
      <Modal
        visible={!!editingProgress}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Progresso</Text>
              <TouchableOpacity onPress={() => setEditingProgress(null)}>
                <Icon name="x" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={editForm.pesoAtual}
              onChangeText={(text) => setEditForm({...editForm, pesoAtual: text})}
              placeholder="Peso Atual (kg)"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={editForm.imc}
              onChangeText={(text) => setEditForm({...editForm, imc: text})}
              placeholder="IMC"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={editForm.performance}
              onChangeText={(text) => setEditForm({...editForm, performance: text})}
              placeholder="Performance"
              placeholderTextColor="#666"
            />
            <TextInput
              style={styles.input}
              value={editForm.treinosConcluidos}
              onChangeText={(text) => setEditForm({...editForm, treinosConcluidos: text})}
              placeholder="Treinos Concluídos"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProgress}>
              <Text style={styles.saveButtonText}>Atualizar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setEditingProgress(null)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Edição de Desempenho */}
      <Modal
        visible={!!editingPerformance}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Desempenho</Text>
              <TouchableOpacity onPress={() => setEditingPerformance(null)}>
                <Icon name="x" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              value={editForm.pesoLevantado}
              onChangeText={(text) => setEditForm({...editForm, pesoLevantado: text})}
              placeholder="Peso Levantado (kg)"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={editForm.repeticoes}
              onChangeText={(text) => setEditForm({...editForm, repeticoes: text})}
              placeholder="Repetições"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editForm.observacoes}
              onChangeText={(text) => setEditForm({...editForm, observacoes: text})}
              placeholder="Observações"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleUpdatePerformance}>
              <Text style={styles.saveButtonText}>Atualizar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setEditingPerformance(null)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    flex:1,
    textAlign:'center'
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  logItem: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logDate: {
    color: '#35AAFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  logText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#262626',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#35AAFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191919',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191919',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#35AAFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
  },
});

export default ProgressScreen;

