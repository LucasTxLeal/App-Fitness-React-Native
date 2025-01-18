import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  obterSolicitacoesPersonal,
  aceitarSolicitacao,
  recusarSolicitacao,
} from '../services/mockApi'; // Alterado para usar mockApi

const ManageRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Calling obterSolicitacoesPersonal...');
      const data = await obterSolicitacoesPersonal();
      console.log('Received data:', data);
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
      setError('Não foi possível carregar as solicitações. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [loadRequests])
  );

  const handleAccept = async (requestId) => {
    try {
      await aceitarSolicitacao(requestId);
      Alert.alert('Sucesso', 'Solicitação aceita com sucesso!');
      navigation.navigate('CreateTrainingPlan', { requestId });
    } catch (error) {
      console.error('Erro ao aceitar solicitação:', error);
      Alert.alert('Erro', 'Não foi possível aceitar a solicitação');
    }
  };

  const handleReject = async (requestId) => {
    Alert.alert(
      'Confirmar',
      'Tem certeza que deseja recusar esta solicitação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Recusar',
          style: 'destructive',
          onPress: async () => {
            try {
              await recusarSolicitacao(requestId);
              Alert.alert('Sucesso', 'Solicitação recusada com sucesso!');
              loadRequests();
            } catch (error) {
              console.error('Erro ao recusar solicitação:', error);
              Alert.alert('Erro', 'Não foi possível recusar a solicitação');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Solicitações de Alunos</Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#35AAFF" />
          <Text style={styles.loadingText}>Carregando solicitações...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Solicitações de Alunos</Text>
        </View>
        <View style={styles.centerContainer}>
          <Icon name="alert-circle" size={48} color="#666" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadRequests}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Solicitações de Alunos</Text>
        <TouchableOpacity onPress={loadRequests} style={styles.refreshButton}>
          <Icon name="refresh-cw" size={20} color="#35AAFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={48} color="#666" />
            <Text style={styles.emptyText}>
              Nenhuma solicitação pendente no momento
            </Text>
          </View>
        ) : (
          requests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <Text style={styles.userName}>{request.usuario.nome}</Text>
                <Text style={styles.requestDate}>
                  {new Date(request.data_solicitacao).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.requestSection}>
                <Text style={styles.sectionLabel}>Objetivo:</Text>
                <Text style={styles.sectionText}>{request.objetivo}</Text>
              </View>

              <View style={styles.requestSection}>
                <Text style={styles.sectionLabel}>Disponibilidade:</Text>
                <View style={styles.availabilityContainer}>
                  <Text style={styles.availabilityText}>
                    Horários: {request.disponibilidade.horarios.join(', ')}
                  </Text>
                  <Text style={styles.availabilityText}>
                    Dias: {request.disponibilidade.dias.join(', ')}
                  </Text>
                </View>
              </View>

              {request.mensagem && (
                <View style={styles.requestSection}>
                  <Text style={styles.sectionLabel}>Mensagem:</Text>
                  <Text style={styles.sectionText}>{request.mensagem}</Text>
                </View>
              )}

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.acceptButton]}
                  onPress={() => handleAccept(request.id)}
                >
                  <Icon name="check" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Aceitar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleReject(request.id)}
                >
                  <Icon name="x" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Recusar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
  },
  requestCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  requestDate: {
    color: '#666',
    fontSize: 14,
  },
  requestSection: {
    marginBottom: 12,
  },
  sectionLabel: {
    color: '#35AAFF',
    fontSize: 14,
    marginBottom: 4,
  },
  sectionText: {
    color: '#fff',
    fontSize: 16,
  },
  availabilityContainer: {
    backgroundColor: '#262626',
    borderRadius: 8,
    padding: 12,
  },
  availabilityText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  acceptButton: {
    backgroundColor: '#4CD964',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#35AAFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManageRequestsScreen;

