import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import { enviarSolicitacaoPersonal } from '../services/api';

const AVAILABLE_TIMES = [
  'Manhã (6h-12h)',
  'Tarde (12h-18h)',
  'Noite (18h-22h)',
];

const DAYS_OF_WEEK = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
  'Domingo',
];

const RequestTrainerScreen = ({ navigation }) => {
  const [objetivo, setObjetivo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleTime = (time) => {
    setSelectedTimes(prev => 
      prev.includes(time)
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const toggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSubmit = async () => {
    if (!objetivo.trim()) {
      Alert.alert('Erro', 'Por favor, defina seu objetivo');
      return;
    }

    if (selectedTimes.length === 0 || selectedDays.length === 0) {
      Alert.alert('Erro', 'Por favor, selecione horários e dias disponíveis');
      return;
    }

    setLoading(true);
    try {
      await enviarSolicitacaoPersonal({
        objetivo,
        mensagem: mensagem.trim(),
        disponibilidade: {
          horarios: selectedTimes,
          dias: selectedDays,
        },
      });

      Alert.alert(
        'Sucesso',
        'Sua solicitação foi enviada com sucesso! Um personal trainer entrará em contato.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      Alert.alert(
        'Erro',
        'Não foi possível enviar sua solicitação. Por favor, tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Solicitar Personal Trainer</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seu Objetivo</Text>
          <TextInput
            style={styles.input}
            placeholder="Descreva seu objetivo (ex: ganho de massa, emagrecimento)"
            placeholderTextColor="#666"
            value={objetivo}
            onChangeText={setObjetivo}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disponibilidade - Horários</Text>
          <View style={styles.optionsGrid}>
            {AVAILABLE_TIMES.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.optionButton,
                  selectedTimes.includes(time) && styles.optionButtonSelected,
                ]}
                onPress={() => toggleTime(time)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    selectedTimes.includes(time) && styles.optionButtonTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disponibilidade - Dias</Text>
          <View style={styles.optionsGrid}>
            {DAYS_OF_WEEK.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.optionButton,
                  selectedDays.includes(day) && styles.optionButtonSelected,
                ]}
                onPress={() => toggleDay(day)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    selectedDays.includes(day) && styles.optionButtonTextSelected,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mensagem Adicional (Opcional)</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Alguma informação adicional que queira compartilhar?"
            placeholderTextColor="#666"
            value={mensagem}
            onChangeText={setMensagem}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="send" size={20} color="#fff" style={styles.submitIcon} />
              <Text style={styles.submitButtonText}>Enviar Solicitação</Text>
            </>
          )}
        </TouchableOpacity>
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
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  messageInput: {
    minHeight: 100,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    minWidth: '30%',
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#35AAFF',
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  optionButtonTextSelected: {
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#35AAFF',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RequestTrainerScreen;

