import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import styles from './styles';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import api from '../api';
import logoBranca from '../../assets/iejc-horizontal-branco.png';
import logoBranca2 from '../../assets/tecoletaBranco.png';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Validação de email usando regex
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação de senha
  // const isValidPassword = (password: string) => {
  //   // Mínimo 8 caracteres, pelo menos uma letra e um número
  //   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  //   return passwordRegex.test(password);
  // };

  const handleSignUp = async () => {
    try {
      setIsLoading(true);

      // Validações básicas
      if (!email || !senha || !confirmarSenha) {
        Toast.show({
          type: 'error',
          text1: 'Erro no cadastro',
          text2: 'Todos os campos devem ser preenchidos',
        });
        return;
      }

      // Validação de email
      if (!isValidEmail(email)) {
        Toast.show({
          type: 'error',
          text1: 'Email inválido',
          text2: 'Por favor, insira um email válido',
        });
        return;
      }

      // // Validação de senha
      // if (!isValidPassword(senha)) {
      //   Toast.show({
      //     type: 'error',
      //     text1: 'Senha inválida',
      //     text2: 'A senha deve ter no mínimo 8 caracteres, uma letra e um número',
      //   });
      //   return;
      // }

      // Verificação de senhas iguais
      if (senha !== confirmarSenha) {
        Toast.show({
          type: 'error',
          text1: 'Erro no cadastro',
          text2: 'As senhas não coincidem',
        });
        return;
      }

      // Primeiro, verifica se o email já existe
      const checkEmailResponse = await api.post('/verificar-email', { email });
      
      if (checkEmailResponse.data.exists) {
        Toast.show({
          type: 'error',
          text1: 'Email já cadastrado',
          text2: 'Por favor, use outro email ou faça login',
        });
        return;
      }

      // Se o email não existe, procede com o cadastro
      const response = await api.post('/cadastro', {
        email,
        senha,
        verificado: false // indica que o email ainda não foi verificado
      });

      if (response.data.success) {
        
        Toast.show({
          type: 'success',
          text1: 'Cadastro realizado!',
          text2: 'Verifique seu email para ativar sua conta',
        });

        // Navega para uma tela de confirmação
        navigation.navigate('Login', { email });
      }

    } catch (error) {
      console.error('Erro ao cadastrar:', error.response?.data || error.message);
      
      Toast.show({
        type: 'error',
        text1: 'Erro ao cadastrar',
        text2: 'Verifique sua conexão e tente novamente.',
      });
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
        <Text style={styles.loginText}>Cadastro</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          secureTextEntry
          editable={!isLoading}
        />

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.disabledButton]} 
          onPress={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.loginButtonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          disabled={isLoading}
        >
          <Text style={styles.forgotPassword}>Já tenho uma conta</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.footer} />
    </SafeAreaView>
  );
};

export default SignUpScreen;