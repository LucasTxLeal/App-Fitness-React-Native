import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather as Icon } from '@expo/vector-icons';
import { registrarPersonal } from '../services/api';
import { format } from 'date-fns';

const RegisterTrainerScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    especialidade: '',
    peso: '',
    altura: '',
    datadenascimento: new Date(),
    certificado: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('datadenascimento', selectedDate);
    }
  };

  const handleCertificadoChange = (text) => {
    handleInputChange('certificado', text);
  };

  const handleRegister = async () => {
    try {
      const formattedData = {
        ...formData,
        datadenascimento: format(formData.datadenascimento, 'yyyy-MM-dd'),
        peso: parseFloat(formData.peso),
        altura: parseFloat(formData.altura)
      };
      console.log('Dados formatados para envio:', formattedData);
      const response = await registrarPersonal(formattedData);
      console.log('Registro de personal bem-sucedido:', response);
      Alert.alert('Sucesso', 'Registro de personal realizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Main') }
      ]);
    } catch (error) {
      console.error('Erro no registro de personal:', error);
      Alert.alert('Erro', error.message || 'Ocorreu um erro durante o registro de personal.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Registrar como Personal Trainer</Text>
        
        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            placeholderTextColor="#666"
            value={formData.nome}
            onChangeText={(text) => handleInputChange('nome', text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="mail" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#666"
            secureTextEntry
            value={formData.senha}
            onChangeText={(text) => handleInputChange('senha', text)}
          />
        </View>


        <View style={styles.inputContainer}>
          <Icon name="award" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Especialização"
            placeholderTextColor="#666"
            value={formData.especialidade}
            onChangeText={(text) => handleInputChange('especialidade', text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="tag" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Peso (kg)"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={formData.peso}
            onChangeText={(text) => handleInputChange('peso', text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="arrow-up" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Altura (cm)"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={formData.altura}
            onChangeText={(text) => handleInputChange('altura', text)}
          />
        </View>

        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Icon name="calendar" size={20} color="#666" style={styles.inputIcon} />
          <Text style={styles.datePickerButtonText}>
            {formData.datadenascimento.toDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={formData.datadenascimento}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <View style={styles.inputContainer}>
          <Icon name="award" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Certificados"
            placeholderTextColor="#666"
            value={formData.certificado}
            onChangeText={handleCertificadoChange}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar como Personal Trainer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginLinkText}>
            Já tem uma conta? Faça login
          </Text>
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    fontSize: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  datePickerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#35AAFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#35AAFF',
    fontSize: 16,
  },
});

export default RegisterTrainerScreen;

