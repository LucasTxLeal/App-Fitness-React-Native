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

const PersonalRegistration = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
    certification: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.password) newErrors.password = 'Senha é obrigatória';
    else if (formData.password.length < 6) newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    if (!formData.specialty) newErrors.specialty = 'Especialidade é obrigatória';
    if (!formData.certification) newErrors.certification = 'Certificação é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // In a real app, you'd send this data to your backend
      // For now, we'll just navigate to the Home screen
      navigation.navigate('Home');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Cadastro de Personal Trainer</Text>

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

          <TextInput
            style={styles.input}
            placeholder="Especialidade"
            value={formData.specialty}
            onChangeText={(text) => setFormData(prev => ({ ...prev, specialty: text }))}
          />
          {errors.specialty && <Text style={styles.errorText}>{errors.specialty}</Text>}

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Certificações"
            multiline
            numberOfLines={4}
            value={formData.certification}
            onChangeText={(text) => setFormData(prev => ({ ...prev, certification: text }))}
          />
          {errors.certification && <Text style={styles.errorText}>{errors.certification}</Text>}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => navigation.navigate('RegisterUser')}
        >
          <Text style={styles.linkText}>Sou Aluno</Text>
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

export default PersonalRegistration;

