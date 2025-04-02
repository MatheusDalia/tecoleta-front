import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { useNavigation, StackNavigationProp } from '@react-navigation/native';
import styles from './styles';
import api from '../api';
import Toast from 'react-native-toast-message';
import logoBranca from '../../assets/iejc-horizontal-branco.png';
import logoBranca2 from '../../assets/tecoletaBranco.png';

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const handleResetPassword = async () => {
    // Validação básica
    if (!email || !email.includes('@')) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return;
    }

    setIsLoading(true);

    try {
      // Chamada à API para enviar email de redefinição de senha
      const response = await api.post('/reset-password', { email });
      
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Email enviado com sucesso!',
        text2: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
      
      // Após enviar o email, voltar para a tela de login
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
      
    } catch (error: any) {
      console.error('Erro ao enviar email de redefinição:', error);
      
      const errorMessage = error.response?.data?.message || 
                          'Não foi possível enviar o email de redefinição. Tente novamente mais tarde.';
      
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Erro',
        text2: errorMessage,
      });
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={logoBranca2} style={styles.logoBranca} />
          <Image source={logoBranca} style={styles.logoBranca} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.loginText}>Esqueci a Senha</Text>
        
        <Text style={styles.instructionText}>
          Digite seu email abaixo para receber um link de redefinição de senha.
        </Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        
        {isLoading ? (
          <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleResetPassword}>
            <Text style={styles.loginButtonText}>Enviar Email</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          style={styles.backToLoginButton}
        >
          <Text style={styles.backToLoginText}>Voltar para o login</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.footer} />
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;