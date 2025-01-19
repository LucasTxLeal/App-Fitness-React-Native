import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather as Icon } from '@expo/vector-icons';
import { registrarPersonal } from '../services/api';
import { format } from 'date-fns';

const dayTranslations = {
  'Sun': 'Dom',
  'Mon': 'Seg',
  'Tue': 'Ter',
  'Wed': 'Qua',
  'Thu': 'Qui',
  'Fri': 'Sex',
  'Sat': 'Sáb',
  'Sunday': 'Domingo',
  'Monday': 'Segunda',
  'Tuesday': 'Terça',
  'Wednesday': 'Quarta',
  'Thursday': 'Quinta',
  'Friday': 'Sexta',
  'Saturday': 'Sábado'
};

const RegisterTrainerScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    datadenascimento: new Date(),
    peso: '',
    altura: '',
    especialidade: '',
    certificado: '',
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('datadenascimento', selectedDate);
    }
  };

  const handlePesoChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    handleInputChange('peso', numericValue);
  };

  const handleAlturaChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    handleInputChange('altura', numericValue);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email é inválido';
    if (!formData.senha) newErrors.senha = 'Senha é obrigatória';
    else if (formData.senha.length < 6) newErrors.senha = 'A senha deve ter pelo menos 6 caracteres';
    if (!formData.peso) newErrors.peso = 'Peso é obrigatório';
    if (!formData.altura) newErrors.altura = 'Altura é obrigatória';
    if (!formData.especialidade) newErrors.especialidade = 'Especialidade é obrigatória';
    if (!formData.certificado) newErrors.certificado = 'Número do certificado é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const formattedData = {
          ...formData,
          datadenascimento: format(formData.datadenascimento, 'yyyy-MM-dd'),
          peso: parseFloat(formData.peso),
          altura: parseFloat(formData.altura)
        };
        console.log('Dados formatados para envio:', formattedData);
        const response = await registrarPersonal(formattedData);
        console.log('Registro bem-sucedido:', response);
        Alert.alert('Sucesso', 'Personal Trainer registrado com sucesso!', [
          { text: 'OK', onPress: () => navigation.navigate('Main') }
        ]);
      } catch (error) {
        console.error('Erro no registro:', error);
        Alert.alert('Erro', error.message || 'Ocorreu um erro durante o registro.');
      }
    }
  };

  const formatDate = (date) => {
    const parts = date.toDateString().split(' ');
    return parts.map(part => dayTranslations[part] || part).join(' ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Registro de Personal Trainer</Text>

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
        {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

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
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

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
        {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}

        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Icon name="calendar" size={20} color="#666" style={styles.inputIcon} />
          <Text style={styles.datePickerButtonText}>
            {formatDate(formData.datadenascimento)}
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
          <Icon name="tag" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Peso (kg)"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={formData.peso}
            onChangeText={handlePesoChange}
          />
        </View>
        {errors.peso && <Text style={styles.errorText}>{errors.peso}</Text>}

        <View style={styles.inputContainer}>
          <Icon name="arrow-up" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Altura (cm)"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={formData.altura}
            onChangeText={handleAlturaChange}
          />
        </View>
        {errors.altura && <Text style={styles.errorText}>{errors.altura}</Text>}

        <View style={styles.inputContainer}>
          <Icon name="award" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Especialidade"
            placeholderTextColor="#666"
            value={formData.especialidade}
            onChangeText={(text) => handleInputChange('especialidade', text)}
          />
        </View>
        {errors.especialidade && <Text style={styles.errorText}>{errors.especialidade}</Text>}

        <View style={styles.inputContainer}>
          <Icon name="file-text" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Número do Certificado"
            placeholderTextColor="#666"
            value={formData.certificado}
            onChangeText={(text) => handleInputChange('certificado', text)}
          />
        </View>
        {errors.certificado && <Text style={styles.errorText}>{errors.certificado}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => navigation.navigate('RegisterUser')}
        >
          <Text style={styles.linkText}>Registrar como Usuário</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 30,
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
    color: '#FFF',
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
    color: '#FFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#35AAFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  linkText: {
    color: '#35AAFF',
    fontSize: 16,
  },
  errorText: {
    color: '#FF375B',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
});

export default RegisterTrainerScreen;

