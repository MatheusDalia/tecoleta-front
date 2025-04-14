import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api';
import Toast from 'react-native-toast-message';
import styles from './styles';
import logoBranca from '../../assets/iejc-horizontal-branco.png';
import logoBranca2 from '../../assets/tecoletaBranco.png';

const NewPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const handleNewPassword = async () => {
    if (!email || !token || !newPassword) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/new-password', {
        email,
        token,
        newPassword,
      });

      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Senha alterada com sucesso!',
        text2: 'Agora você pode fazer login com sua nova senha.',
      });

      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);

    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        'Não foi possível redefinir sua senha. Tente novamente mais tarde.';

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

      <Text style={styles.loginText}>Redefinir Senha</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Token recebido por e-mail"
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Nova Senha"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleNewPassword}>
          <Text style={styles.loginButtonText}>Alterar Senha</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.backToLoginButton}
      >
        <Text style={styles.backToLoginText}>Voltar para o login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default NewPasswordScreen;
