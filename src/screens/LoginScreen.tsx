import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, StackNavigationProp } from '@react-navigation/native';
import styles from './styles';
import api from '../api';
import Toast from 'react-native-toast-message';
import AuthContext from '../contexts/AuthContext';

// Definir os tipos para a navegação
type RootStackParamList = {
  Login: undefined;
  ObrasScreen: undefined;
  SignUp: undefined;
  ForgotPassword: undefined; // Adicionado nova rota
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const { setUser } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const response = await api.post('/login', {
        email,
        senha,
      });
      
      console.log('Resposta da API:', response.data);
      
      if (response.data.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Decodificar o token para pegar o ID correto
        const tokenParts = response.data.token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        
        const userObject = {
          id: payload.id, // Usar o ID do token em vez de um valor fixo
          email: email,
          token: response.data.token,
          role: payload.role
        };
        
        console.log('Login bem-sucedido, dados do usuário:', userObject);
        
        // Primeiro setar o usuário
        await setUser(userObject);
        
        // Mostrar o Toast
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Login bem-sucedido!',
          text2: 'Você será redirecionado.',
          onShow: () => {
            // Navegar após o Toast aparecer
            setTimeout(() => {
              console.log('Navegando para ObrasScreen...');
              navigation.reset({
                index: 0,
                routes: [{ name: 'ObrasScreen' }],
              });
            }, 1000);
          }
        });
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao tentar fazer login';
      
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Ocorreu um erro',
        text2: errorMessage,
      });
      
      Alert.alert('Erro', errorMessage);
    }
  };

  // Navegar para a tela de esqueci senha
  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.loginText}>Login</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={navigateToForgotPassword}>
          <Text style={styles.forgotPassword}>Esqueci a senha</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpLink}>Criar conta</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.footer} />
    </SafeAreaView>
  );
};

export default LoginScreen;