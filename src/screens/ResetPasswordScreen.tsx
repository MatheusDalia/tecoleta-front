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
} from 'react-native';
import { useNavigation, StackNavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import styles from './styles';
import api from '../api';
import Toast from 'react-native-toast-message';

type RootStackParamList = {
  Login: undefined;
  ResetPassword: { token?: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  // Obter token da URL ou dos parâmetros da rota
  const token = route.params?.token || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('token') : null);

  const handleResetPassword = async () => {
    // Validar entrada
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    if (!token) {
      Alert.alert('Erro', 'Token de redefinição inválido.');
      return;
    }

    setIsLoading(true);
    try {
      // Chamada à API para definir nova senha
      const response = await api.post('/new-password', { token, newPassword });
      
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Senha redefinida com sucesso!',
        text2: 'Você pode fazer login agora com sua nova senha.',
        onShow: () => {
          // Navegar após o Toast aparecer
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }, 1000);
        }
      });
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao tentar redefinir sua senha';
      
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Ocorreu um erro',
        text2: errorMessage,
      });
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.loginText}>Redefinir Senha</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Nova Senha"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>Redefinir Senha</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signUpLink}>Voltar para o login</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.footer} />
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;