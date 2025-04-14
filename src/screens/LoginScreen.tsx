import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, StackNavigationProp } from '@react-navigation/native';
import styles from './styles';
import api from '../api';
import Toast from 'react-native-toast-message';
import AuthContext from '../contexts/AuthContext';
import logo from '../../assets/iejc-png.png';
import logo2 from '../../assets/logo_tecoleta.png';
import logoBranca from '../../assets/iejc-horizontal-branco.png';
import logoBranca2 from '../../assets/tecoletaBranco.png';


type RootStackParamList = {
  Login: undefined;
  ObrasScreen: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const [senhaVisivel, setSenhaVisivel] = useState(false);
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

        const tokenParts = response.data.token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));

        const userObject = {
          id: payload.id,
          email: email,
          token: response.data.token,
          role: payload.role
        };

        console.log('Login bem-sucedido, dados do usuário:', userObject);

        await setUser(userObject);

        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Login bem-sucedido!',
          text2: 'Você será redirecionado.',
          onShow: () => {
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

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const navigateToNewPassword = () => {
    navigation.navigate('NewPassword');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
      </View>
      <ScrollView contentContainerStyle={styles.content}>

      <View style={styles.logoContainer}>
        <Image source={logo2} style={styles.logo} />
        <Image source={logo} style={styles.logo} />
      </View> 

        <Text style={styles.loginText}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!senhaVisivel}
          />
          <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
            <MaterialCommunityIcons
              name={senhaVisivel ? 'eye-off' : 'eye'}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToForgotPassword}>
          <Text style={styles.forgotPassword}>Esqueci a senha</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpLink}>Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToNewPassword}>
          <Text style={styles.forgotPassword}>Inserir senha nova</Text>
        </TouchableOpacity>

      </ScrollView>
      <View style={styles.footer} />
    </SafeAreaView>
  );
};

export default LoginScreen;
