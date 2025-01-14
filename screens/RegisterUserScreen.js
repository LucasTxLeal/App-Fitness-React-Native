import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const RegisterUserScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: new Date(),
    weight: '',
    height: '',
    goal: '',
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    else if (formData.password.length < 6) newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    if (!formData.weight) newErrors.weight = 'Peso é obrigatório';
    if (!formData.height) newErrors.height = 'Altura é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      navigation.navigate('Home');
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, birthDate: selectedDate }));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Cadastro de Aluno</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            value={formData.name}
            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {formData.birthDate.toLocaleDateString('pt-BR')}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.birthDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Peso (kg)"
            keyboardType="decimal-pad"
            value={formData.weight}
            onChangeText={(text) => setFormData(prev => ({ ...prev, weight: text }))}
          />
          {errors.weight && <Text style={styles.errorText}>{errors.weight}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Altura (cm)"
            keyboardType="decimal-pad"
            value={formData.height}
            onChangeText={(text) => setFormData(prev => ({ ...prev, height: text }))}
          />
          {errors.height && <Text style={styles.errorText}>{errors.height}</Text>}

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Objetivo"
            multiline
            numberOfLines={4}
            value={formData.goal}
            onChangeText={(text) => setFormData(prev => ({ ...prev, goal: text }))}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => navigation.navigate('RegisterTrainer')}
        >
          <Text style={styles.linkText}>Sou Personal Trainer</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 7,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#FFF',
    borderRadius: 7,
    padding: 10,
    marginBottom: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#35AAFF',
    borderRadius: 7,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    padding: 10,
  },
  linkText: {
    color: '#35AAFF',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF375B',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default RegisterUserScreen;
